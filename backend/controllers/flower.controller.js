/**
 * Flower Controller - Product Management
 *
 * This controller handles all flower/product related operations including
 * CRUD operations, search, filtering, and inventory management.
 *
 * Features:
 * - Get all flowers with filtering and pagination
 * - Get single flower with reviews and ratings
 * - Create, update, delete flowers (admin only)
 * - Search flowers by name/description
 * - Filter by category, price range, availability
 * - Get featured products
 * - Inventory management
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import models from '../models/index.js';
import { Op } from 'sequelize';

const { Flower, ProductReview, User, Wishlist } = models;

/**
 * Get all flowers with filtering and pagination
 *
 * @route GET /api/flowers
 * @access Public
 * @query {string} category - Filter by category
 * @query {string} status - Filter by status (default: active)
 * @query {boolean} featured - Filter featured products
 * @query {number} minPrice - Minimum price filter
 * @query {number} maxPrice - Maximum price filter
 * @query {string} search - Search in name and description
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} sort - Sort by: name, price, created, rating
 * @query {string} order - Sort order: asc, desc (default: asc)
 */
export const getAllFlowers = async (req, res) => {
    try {
        const {
            category,
            status = 'active',
            featured,
            minPrice,
            maxPrice,
            search,
            page = 1,
            limit = 20,
            sort = 'name',
            order = 'asc'
        } = req.query;

        // Build where clause
        const whereClause = {};

        // Status filter
        if (status && status !== 'all') {
            whereClause.status = status;
        }

        // Category filter
        if (category && category !== 'all') {
            whereClause.category = category;
        }

        // Featured filter
        if (featured !== undefined) {
            whereClause.isFeatured = featured === 'true';
        }

        // Price range filter
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
        }

        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        // Sort options
        const validSortFields = ['name', 'price', 'createdAt', 'stock'];
        const sortField = validSortFields.includes(sort) ? sort : 'name';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        // Execute query with simplified approach
        const { count, rows: flowers } = await Flower.findAndCountAll({
            where: whereClause,
            order: [[sortField, sortOrder]],
            limit: limitNum,
            offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / limitNum);
        const hasNext = pageNum < totalPages;
        const hasPrev = pageNum > 1;

        res.json({
            flowers: flowers.map(flower => ({
                ...flower.toJSON(),
                isAvailable: flower.isAvailable(),
                stockStatus: flower.getStockStatus(),
                formattedPrice: flower.getFormattedPrice(),
                isOnSale: flower.isOnSale(),
                discountPercentage: flower.getDiscountPercentage()
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                pages: totalPages,
                hasNext,
                hasPrev
            },
            filters: {
                category,
                status,
                featured,
                minPrice,
                maxPrice,
                search
            }
        });

    } catch (error) {
        console.error('Get all flowers error:', error);
        res.status(500).json({
            message: 'Failed to fetch flowers',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get single flower with detailed information
 *
 * @route GET /api/flowers/:id
 * @access Public
 * @param {number} id - Flower ID
 */
export const getFlowerById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // From optional auth middleware

        const flower = await Flower.findByPk(id, {
            include: [
                {
                    model: ProductReview,
                    as: 'reviews',
                    where: { isApproved: true },
                    required: false,
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'firstName']
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                    limit: 10
                }
            ]
        });

        if (!flower) {
            return res.status(404).json({
                message: 'Flower not found'
            });
        }

        // Get rating statistics
        const ratingStats = await ProductReview.getFlowerRatingStats(id);

        // Check if user has this in wishlist (if authenticated)
        let isInWishlist = false;
        if (userId) {
            isInWishlist = await Wishlist.isInWishlist(userId, id);
        }

        res.json({
            ...flower.toJSON(),
            ...ratingStats,
            isAvailable: flower.isAvailable(),
            stockStatus: flower.getStockStatus(),
            formattedPrice: flower.getFormattedPrice(),
            formattedOriginalPrice: flower.getFormattedOriginalPrice(),
            isOnSale: flower.isOnSale(),
            discountPercentage: flower.getDiscountPercentage(),
            isInWishlist,
            reviews: flower.reviews?.map(review => ({
                ...review.toJSON(),
                starDisplay: review.getStarDisplay(),
                userName: review.user?.name || review.user?.firstName || 'Anonymous'
            })) || []
        });

    } catch (error) {
        console.error('Get flower by ID error:', error);
        res.status(500).json({
            message: 'Failed to fetch flower',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get featured flowers
 *
 * @route GET /api/flowers/featured
 * @access Public
 * @query {number} limit - Number of featured flowers (default: 6)
 */
export const getFeaturedFlowers = async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        const limitNum = Math.min(20, Math.max(1, parseInt(limit)));

        const flowers = await Flower.getFeatured(limitNum);

        res.json({
            flowers: flowers.map(flower => ({
                ...flower.toJSON(),
                isAvailable: flower.isAvailable(),
                stockStatus: flower.getStockStatus(),
                formattedPrice: flower.getFormattedPrice(),
                isOnSale: flower.isOnSale(),
                discountPercentage: flower.getDiscountPercentage()
            }))
        });

    } catch (error) {
        console.error('Get featured flowers error:', error);
        res.status(500).json({
            message: 'Failed to fetch featured flowers',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get flowers by category
 *
 * @route GET /api/flowers/category/:category
 * @access Public
 * @param {string} category - Flower category
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
export const getFlowersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const flowers = await Flower.getByCategory(category, { limit: limitNum, offset });
        const totalCount = await Flower.count({ where: { category, status: 'active' } });

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            flowers: flowers.map(flower => ({
                ...flower.toJSON(),
                isAvailable: flower.isAvailable(),
                stockStatus: flower.getStockStatus(),
                formattedPrice: flower.getFormattedPrice(),
                isOnSale: flower.isOnSale(),
                discountPercentage: flower.getDiscountPercentage()
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalCount,
                pages: totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            },
            category
        });

    } catch (error) {
        console.error('Get flowers by category error:', error);
        res.status(500).json({
            message: 'Failed to fetch flowers by category',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Create new flower (Admin only)
 *
 * @route POST /api/flowers
 * @access Private (Admin)
 * @body {Object} flowerData - Flower information
 */
export const createFlower = async (req, res) => {
    try {
        const flowerData = req.body;

        // Input validation
        const requiredFields = ['name', 'price', 'category'];
        const missingFields = requiredFields.filter(field => !flowerData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missingFields
            });
        }

        // Create flower
        const flower = await Flower.create(flowerData);

        res.status(201).json({
            message: 'Flower created successfully',
            flower: {
                ...flower.toJSON(),
                isAvailable: flower.isAvailable(),
                stockStatus: flower.getStockStatus(),
                formattedPrice: flower.getFormattedPrice()
            }
        });

    } catch (error) {
        console.error('Create flower error:', error);

        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = {};
            error.errors.forEach(err => {
                validationErrors[err.path] = err.message;
            });

            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        res.status(500).json({
            message: 'Failed to create flower',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update flower (Admin only)
 *
 * @route PUT /api/flowers/:id
 * @access Private (Admin)
 * @param {number} id - Flower ID
 * @body {Object} updateData - Updated flower information
 */
export const updateFlower = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const flower = await Flower.findByPk(id);
        if (!flower) {
            return res.status(404).json({
                message: 'Flower not found'
            });
        }

        // Update flower
        await flower.update(updateData);

        res.json({
            message: 'Flower updated successfully',
            flower: {
                ...flower.toJSON(),
                isAvailable: flower.isAvailable(),
                stockStatus: flower.getStockStatus(),
                formattedPrice: flower.getFormattedPrice()
            }
        });

    } catch (error) {
        console.error('Update flower error:', error);

        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = {};
            error.errors.forEach(err => {
                validationErrors[err.path] = err.message;
            });

            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        res.status(500).json({
            message: 'Failed to update flower',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Delete flower (Admin only)
 *
 * @route DELETE /api/flowers/:id
 * @access Private (Admin)
 * @param {number} id - Flower ID
 */
export const deleteFlower = async (req, res) => {
    try {
        const { id } = req.params;

        const flower = await Flower.findByPk(id);
        if (!flower) {
            return res.status(404).json({
                message: 'Flower not found'
            });
        }

        // Soft delete by setting status to discontinued
        await flower.update({ status: 'discontinued' });

        res.json({
            message: 'Flower deleted successfully'
        });

    } catch (error) {
        console.error('Delete flower error:', error);
        res.status(500).json({
            message: 'Failed to delete flower',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update flower stock (Admin only)
 *
 * @route PATCH /api/flowers/:id/stock
 * @access Private (Admin)
 * @param {number} id - Flower ID
 * @body {number} stock - New stock quantity
 */
export const updateFlowerStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({
                message: 'Stock must be a non-negative number'
            });
        }

        const flower = await Flower.findByPk(id);
        if (!flower) {
            return res.status(404).json({
                message: 'Flower not found'
            });
        }

        await flower.updateStock(stock);

        res.json({
            message: 'Stock updated successfully',
            flower: {
                id: flower.id,
                name: flower.name,
                stock: flower.stock,
                stockStatus: flower.getStockStatus()
            }
        });

    } catch (error) {
        console.error('Update flower stock error:', error);
        res.status(500).json({
            message: 'Failed to update stock',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Backward compatibility
export const getFlowers = getAllFlowers;