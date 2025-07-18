/**
 * Wishlist Routes
 * 
 * This file defines all wishlist-related routes including
 * adding/removing items, viewing wishlist, and managing preferences.
 * 
 * Routes:
 * - GET / - Get user wishlist
 * - POST / - Add item to wishlist
 * - PUT /:id - Update wishlist item
 * - DELETE /:id - Remove item from wishlist
 * - DELETE / - Clear entire wishlist
 * - POST /:id/move-to-cart - Move item to cart
 * - GET /check/:flowerId - Check if item is in wishlist
 * - GET /stats - Get wishlist statistics
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import express from 'express';
import {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    moveToCart,
    checkWishlistStatus,
    getWishlistStats,
    clearWishlist
} from '../controllers/wishlist.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/wishlist
 * @desc Get user's wishlist
 * @access Private
 * @query {string} priority - Filter by priority (low, medium, high)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/', authenticateToken, getUserWishlist);

/**
 * @route GET /api/wishlist/stats
 * @desc Get wishlist statistics
 * @access Private
 */
router.get('/stats', authenticateToken, getWishlistStats);

/**
 * @route GET /api/wishlist/check/:flowerId
 * @desc Check if item is in wishlist
 * @access Private
 * @param {number} flowerId - Flower ID to check
 */
router.get('/check/:flowerId', authenticateToken, checkWishlistStatus);

/**
 * @route POST /api/wishlist
 * @desc Add item to wishlist
 * @access Private
 * @body {number} flowerId - Flower ID to add
 * @body {string} notes - Optional notes (optional)
 * @body {string} priority - Priority level (optional, default: medium)
 * @body {boolean} notificationEnabled - Enable price notifications (optional, default: true)
 */
router.post('/', authenticateToken, addToWishlist);

/**
 * @route PUT /api/wishlist/:id
 * @desc Update wishlist item
 * @access Private
 * @param {number} id - Wishlist item ID
 * @body {string} notes - Updated notes (optional)
 * @body {string} priority - Updated priority (optional)
 * @body {boolean} notificationEnabled - Updated notification setting (optional)
 */
router.put('/:id', authenticateToken, updateWishlistItem);

/**
 * @route POST /api/wishlist/:id/move-to-cart
 * @desc Move wishlist item to cart
 * @access Private
 * @param {number} id - Wishlist item ID
 * @body {number} quantity - Quantity to add to cart (optional, default: 1)
 */
router.post('/:id/move-to-cart', authenticateToken, moveToCart);

/**
 * @route DELETE /api/wishlist/:flowerId
 * @desc Remove item from wishlist by flower ID
 * @access Private
 * @param {number} flowerId - Flower ID to remove
 */
router.delete('/:flowerId', authenticateToken, removeFromWishlist);

/**
 * @route DELETE /api/wishlist
 * @desc Clear entire wishlist
 * @access Private
 */
router.delete('/', authenticateToken, clearWishlist);

export default router;