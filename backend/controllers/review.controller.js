/**
 * Review Controller - Product Review Management
 * 
 * This controller handles all product review operations including
 * creating reviews, fetching reviews, moderation, and rating statistics.
 * 
 * Features:
 * - Get product reviews
 * - Create new review (verified purchase)
 * - Update review
 * - Delete review
 * - Mark review as helpful
 * - Report review
 * - Admin moderation
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import models from '../models/index.js';

const { ProductReview, Flower, User, Order, OrderItem } = models;

/**
 * Get reviews for a flower
 * 
 * @route GET /api/flowers/:flowerId/reviews
 * @access Public
 * @param {number} flowerId - Flower ID
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {string} sort - Sort by: newest, oldest, rating_high, rating_low, helpful
 */
export const getFlowerReviews = async (req, res) => {
    try {
        const { flowerId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        // Check if flower exists
        const flower = await Flower.findByPk(flowerId);
        if (!flower) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const reviews = await ProductReview.getByFlower(flowerId, {
            limit: limitNum,
            offset,
            sort,
            approvedOnly: true
        });

        const totalCount = await ProductReview.count({
            where: { flowerId, isApproved: true }
        });

        const ratingStats = await ProductReview.getFlowerRatingStats(flowerId);

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            reviews: reviews.map(review => ({
                ...review.toJSON(),
                starDisplay: review.getStarDisplay(),
                userName: review.user?.name || review.user?.firstName || 'Anonymous',
                isHelpful: review.isHelpful()
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalCount,
                pages: totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            },
            summary: ratingStats
        });

    } catch (error) {
        console.error('Get flower reviews error:', error);
        res.status(500).json({
            message: 'Failed to fetch reviews',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Create new review
 * 
 * @route POST /api/flowers/:flowerId/reviews
 * @access Private
 * @param {number} flowerId - Flower ID
 * @body {number} orderId - Order ID (for verification)
 * @body {number} rating - Rating (1-5)
 * @body {string} title - Review title (optional)
 * @body {string} comment - Review comment (optional)
 */
export const createReview = async (req, res) => {
    try {
        const { flowerId } = req.params;
        const userId = req.user.id;
        const { orderId, rating, title, comment } = req.body;

        // Input validation
        if (!orderId || !rating) {
            return res.status(400).json({
                message: 'Order ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'Rating must be between 1 and 5'
            });
        }

        const review = await ProductReview.createFromOrder({
            userId,
            flowerId: parseInt(flowerId),
            orderId,
            rating,
            title,
            comment
        });

        res.status(201).json({
            message: 'Review created successfully',
            review: {
                ...review.toJSON(),
                starDisplay: review.getStarDisplay()
            }
        });

    } catch (error) {
        console.error('Create review error:', error);
        
        if (error.message.includes('Cannot review product') || error.message.includes('Review already exists')) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to create review',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get user's reviews
 * 
 * @route GET /api/reviews/my
 * @access Private
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 */
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const reviews = await ProductReview.getByUser(userId, {
            limit: limitNum,
            offset
        });

        const totalCount = await ProductReview.count({
            where: { userId }
        });

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            reviews: reviews.map(review => ({
                ...review.toJSON(),
                starDisplay: review.getStarDisplay(),
                flowerName: review.Flower?.name,
                flowerImage: review.Flower?.image
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalCount,
                pages: totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });

    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({
            message: 'Failed to fetch user reviews',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update review
 * 
 * @route PUT /api/reviews/:id
 * @access Private
 * @param {number} id - Review ID
 * @body {number} rating - Updated rating (optional)
 * @body {string} title - Updated title (optional)
 * @body {string} comment - Updated comment (optional)
 */
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        const review = await ProductReview.findOne({
            where: { id, userId }
        });

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        // Validate rating if provided
        if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
            return res.status(400).json({
                message: 'Rating must be between 1 and 5'
            });
        }

        await review.update(updateData);

        res.json({
            message: 'Review updated successfully',
            review: {
                ...review.toJSON(),
                starDisplay: review.getStarDisplay()
            }
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            message: 'Failed to update review',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Delete review
 * 
 * @route DELETE /api/reviews/:id
 * @access Private
 * @param {number} id - Review ID
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const whereClause = { id };
        if (!isAdmin) {
            whereClause.userId = userId; // Users can only delete their own reviews
        }

        const review = await ProductReview.findOne({ where: whereClause });

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        await review.destroy();

        res.json({
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            message: 'Failed to delete review',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Mark review as helpful
 * 
 * @route POST /api/reviews/:id/helpful
 * @access Private
 * @param {number} id - Review ID
 */
export const markReviewHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await ProductReview.findByPk(id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        // Prevent users from marking their own reviews as helpful
        if (review.userId === userId) {
            return res.status(400).json({
                message: 'Cannot mark your own review as helpful'
            });
        }

        await review.markHelpful();

        res.json({
            message: 'Review marked as helpful',
            helpfulCount: review.helpfulCount
        });

    } catch (error) {
        console.error('Mark review helpful error:', error);
        res.status(500).json({
            message: 'Failed to mark review as helpful',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Report review
 * 
 * @route POST /api/reviews/:id/report
 * @access Private
 * @param {number} id - Review ID
 * @body {string} reason - Report reason (optional)
 */
export const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await ProductReview.findByPk(id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        // Prevent users from reporting their own reviews
        if (review.userId === userId) {
            return res.status(400).json({
                message: 'Cannot report your own review'
            });
        }

        await review.report();

        res.json({
            message: 'Review reported successfully'
        });

    } catch (error) {
        console.error('Report review error:', error);
        res.status(500).json({
            message: 'Failed to report review',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
