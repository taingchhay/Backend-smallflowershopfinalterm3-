/**
 * Wishlist Controller - User Wishlist Management
 * 
 * This controller handles all wishlist operations including
 * adding/removing items, viewing wishlist, and managing
 * wishlist preferences.
 * 
 * Features:
 * - Get user wishlist
 * - Add item to wishlist
 * - Remove item from wishlist
 * - Move item to cart
 * - Update wishlist item preferences
 * - Get wishlist statistics
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import models from '../models/index.js';

const { Wishlist, Flower } = models;

/**
 * Get user's wishlist
 * 
 * @route GET /api/wishlist
 * @access Private
 * @query {string} priority - Filter by priority (low, medium, high)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
export const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { priority, page = 1, limit = 20 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const wishlistItems = await Wishlist.getByUser(userId, {
            priority,
            limit: limitNum,
            offset
        });

        // Get detailed information for each item
        const itemsWithDetails = await Promise.all(
            wishlistItems.map(async (item) => {
                const summary = await item.getSummary();
                return summary;
            })
        );

        // Get total count
        const totalCount = await Wishlist.getCountByUser(userId);
        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            items: itemsWithDetails,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalCount,
                pages: totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            },
            totalItems: totalCount
        });

    } catch (error) {
        console.error('Get user wishlist error:', error);
        res.status(500).json({
            message: 'Failed to fetch wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Add item to wishlist
 * 
 * @route POST /api/wishlist
 * @access Private
 * @body {number} flowerId - Flower ID to add
 * @body {string} notes - Optional notes (optional)
 * @body {string} priority - Priority level (optional, default: medium)
 * @body {boolean} notificationEnabled - Enable price notifications (optional, default: true)
 */
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { flowerId, notes, priority, notificationEnabled } = req.body;

        if (!flowerId) {
            return res.status(400).json({
                message: 'Flower ID is required'
            });
        }

        // Check if flower exists
        const flower = await Flower.findByPk(flowerId);
        if (!flower) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const wishlistItem = await Wishlist.addItem(userId, flowerId, {
            notes,
            priority,
            notificationEnabled
        });

        const itemSummary = await wishlistItem.getSummary();

        res.status(201).json({
            message: 'Item added to wishlist',
            item: itemSummary
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        
        if (error.message === 'Item already exists in wishlist') {
            return res.status(409).json({
                message: 'Item is already in your wishlist'
            });
        }

        if (error.message === 'Product not found') {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(500).json({
            message: 'Failed to add item to wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Remove item from wishlist
 * 
 * @route DELETE /api/wishlist/:flowerId
 * @access Private
 * @param {number} flowerId - Flower ID to remove
 */
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { flowerId } = req.params;

        const removed = await Wishlist.removeItem(userId, parseInt(flowerId));

        if (!removed) {
            return res.status(404).json({
                message: 'Item not found in wishlist'
            });
        }

        res.json({
            message: 'Item removed from wishlist'
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            message: 'Failed to remove item from wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update wishlist item
 * 
 * @route PUT /api/wishlist/:id
 * @access Private
 * @param {number} id - Wishlist item ID
 * @body {string} notes - Updated notes (optional)
 * @body {string} priority - Updated priority (optional)
 * @body {boolean} notificationEnabled - Updated notification setting (optional)
 */
export const updateWishlistItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const updateData = req.body;

        const wishlistItem = await Wishlist.findOne({
            where: { id, userId }
        });

        if (!wishlistItem) {
            return res.status(404).json({
                message: 'Wishlist item not found'
            });
        }

        await wishlistItem.update(updateData);
        const itemSummary = await wishlistItem.getSummary();

        res.json({
            message: 'Wishlist item updated',
            item: itemSummary
        });

    } catch (error) {
        console.error('Update wishlist item error:', error);
        res.status(500).json({
            message: 'Failed to update wishlist item',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Move wishlist item to cart
 * 
 * @route POST /api/wishlist/:id/move-to-cart
 * @access Private
 * @param {number} id - Wishlist item ID
 * @body {number} quantity - Quantity to add to cart (optional, default: 1)
 */
export const moveToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { quantity = 1 } = req.body;

        const wishlistItem = await Wishlist.findOne({
            where: { id, userId }
        });

        if (!wishlistItem) {
            return res.status(404).json({
                message: 'Wishlist item not found'
            });
        }

        const cartItem = await wishlistItem.moveToCart(quantity);

        res.json({
            message: 'Item moved to cart',
            cartItem
        });

    } catch (error) {
        console.error('Move to cart error:', error);
        
        if (error.message.includes('not available') || error.message.includes('Insufficient stock')) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to move item to cart',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Check if item is in wishlist
 * 
 * @route GET /api/wishlist/check/:flowerId
 * @access Private
 * @param {number} flowerId - Flower ID to check
 */
export const checkWishlistStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { flowerId } = req.params;

        const isInWishlist = await Wishlist.isInWishlist(userId, parseInt(flowerId));

        res.json({
            flowerId: parseInt(flowerId),
            isInWishlist
        });

    } catch (error) {
        console.error('Check wishlist status error:', error);
        res.status(500).json({
            message: 'Failed to check wishlist status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get wishlist statistics
 * 
 * @route GET /api/wishlist/stats
 * @access Private
 */
export const getWishlistStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalItems = await Wishlist.getCountByUser(userId);
        
        const priorityCounts = await Wishlist.count({
            where: { userId },
            group: ['priority'],
            attributes: ['priority', [models.sequelize.fn('COUNT', '*'), 'count']]
        });

        const priceChanges = await Wishlist.getItemsWithPriceChanges(userId);

        res.json({
            totalItems,
            priorityBreakdown: priorityCounts.reduce((acc, item) => {
                acc[item.priority] = parseInt(item.dataValues.count);
                return acc;
            }, { low: 0, medium: 0, high: 0 }),
            itemsWithPriceChanges: priceChanges.length,
            availableItems: totalItems - priceChanges.filter(item => !item.Flower || item.Flower.status !== 'active').length
        });

    } catch (error) {
        console.error('Get wishlist stats error:', error);
        res.status(500).json({
            message: 'Failed to fetch wishlist statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Clear entire wishlist
 * 
 * @route DELETE /api/wishlist
 * @access Private
 */
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const deletedCount = await Wishlist.destroy({
            where: { userId }
        });

        res.json({
            message: 'Wishlist cleared successfully',
            deletedItems: deletedCount
        });

    } catch (error) {
        console.error('Clear wishlist error:', error);
        res.status(500).json({
            message: 'Failed to clear wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};