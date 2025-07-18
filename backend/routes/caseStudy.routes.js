/**
 * Flower Routes
 *
 * This file defines all flower/product-related routes including
 * CRUD operations, search, filtering, and product management.
 *
 * Routes:
 * - GET / - Get all flowers with filtering
 * - GET /featured - Get featured flowers
 * - GET /category/:category - Get flowers by category
 * - GET /:id - Get single flower
 * - POST / - Create flower (admin only)
 * - PUT /:id - Update flower (admin only)
 * - DELETE /:id - Delete flower (admin only)
 * - PATCH /:id/stock - Update stock (admin only)
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import express from 'express';
import {
    getAllFlowers,
    getFlowerById,
    getFeaturedFlowers,
    getFlowersByCategory,
    createFlower,
    updateFlower,
    deleteFlower,
    updateFlowerStock
} from '../controllers/flower.controller.js';
import {
    getFlowerReviews,
    createReview
} from '../controllers/review.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/flowers
 * @desc Get all flowers with filtering and pagination
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
router.get('/', getAllFlowers);

/**
 * @route GET /api/flowers/featured
 * @desc Get featured flowers
 * @access Public
 * @query {number} limit - Number of featured flowers (default: 6)
 */
router.get('/featured', getFeaturedFlowers);

/**
 * @route GET /api/flowers/category/:category
 * @desc Get flowers by category
 * @access Public
 * @param {string} category - Flower category
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/category/:category', getFlowersByCategory);

/**
 * @route GET /api/flowers/:id
 * @desc Get single flower with detailed information
 * @access Public (with auth for wishlist status)
 * @param {number} id - Flower ID
 */
router.get('/:id', getFlowerById);

/**
 * @route POST /api/flowers
 * @desc Create new flower
 * @access Private (Admin only)
 * @body {Object} flowerData - Flower information
 */
router.post('/', authenticateToken, requireAdmin, createFlower);

/**
 * @route PUT /api/flowers/:id
 * @desc Update flower
 * @access Private (Admin only)
 * @param {number} id - Flower ID
 * @body {Object} updateData - Updated flower information
 */
router.put('/:id', authenticateToken, requireAdmin, updateFlower);

/**
 * @route DELETE /api/flowers/:id
 * @desc Delete flower (soft delete)
 * @access Private (Admin only)
 * @param {number} id - Flower ID
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteFlower);

/**
 * @route PATCH /api/flowers/:id/stock
 * @desc Update flower stock
 * @access Private (Admin only)
 * @param {number} id - Flower ID
 * @body {number} stock - New stock quantity
 */
router.patch('/:id/stock', authenticateToken, requireAdmin, updateFlowerStock);

/**
 * @route GET /api/flowers/:flowerId/reviews
 * @desc Get reviews for a flower
 * @access Public
 * @param {number} flowerId - Flower ID
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {string} sort - Sort by: newest, oldest, rating_high, rating_low, helpful
 */
router.get('/:flowerId/reviews', getFlowerReviews);

/**
 * @route POST /api/flowers/:flowerId/reviews
 * @desc Create new review for a flower
 * @access Private
 * @param {number} flowerId - Flower ID
 * @body {number} orderId - Order ID (for verification)
 * @body {number} rating - Rating (1-5)
 * @body {string} title - Review title (optional)
 * @body {string} comment - Review comment (optional)
 */
router.post('/:flowerId/reviews', authenticateToken, createReview);

export default router;