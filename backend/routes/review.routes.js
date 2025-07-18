/**
 * Review Routes
 * 
 * This file defines all product review-related routes including
 * creating reviews, fetching reviews, and review moderation.
 * 
 * Routes:
 * - GET /my - Get user's reviews
 * - PUT /:id - Update review
 * - DELETE /:id - Delete review
 * - POST /:id/helpful - Mark review as helpful
 * - POST /:id/report - Report review
 * 
 * Note: Flower-specific review routes are in flower.routes.js:
 * - GET /flowers/:flowerId/reviews - Get reviews for a flower
 * - POST /flowers/:flowerId/reviews - Create review for a flower
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import express from 'express';
import {
    getFlowerReviews,
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    reportReview
} from '../controllers/review.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/reviews/my
 * @desc Get user's reviews
 * @access Private
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 */
router.get('/my', authenticateToken, getUserReviews);

/**
 * @route PUT /api/reviews/:id
 * @desc Update review
 * @access Private
 * @param {number} id - Review ID
 * @body {number} rating - Updated rating (optional)
 * @body {string} title - Updated title (optional)
 * @body {string} comment - Updated comment (optional)
 */
router.put('/:id', authenticateToken, updateReview);

/**
 * @route DELETE /api/reviews/:id
 * @desc Delete review
 * @access Private (Users can delete their own reviews, admins can delete any)
 * @param {number} id - Review ID
 */
router.delete('/:id', authenticateToken, deleteReview);

/**
 * @route POST /api/reviews/:id/helpful
 * @desc Mark review as helpful
 * @access Private
 * @param {number} id - Review ID
 */
router.post('/:id/helpful', authenticateToken, markReviewHelpful);

/**
 * @route POST /api/reviews/:id/report
 * @desc Report review
 * @access Private
 * @param {number} id - Review ID
 * @body {string} reason - Report reason (optional)
 */
router.post('/:id/report', authenticateToken, reportReview);

export default router;
