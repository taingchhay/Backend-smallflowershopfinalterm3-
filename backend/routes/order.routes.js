/**
 * Order Routes
 *
 * This file defines all order-related routes including
 * order creation, retrieval, status updates, and order management.
 *
 * Routes:
 * - POST / - Create new order
 * - GET /my - Get user's orders
 * - GET /:id - Get order details
 * - GET / - Get all orders (admin only)
 * - PUT /:id/status - Update order status (admin only)
 * - POST /:id/cancel - Cancel order
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from '../controllers/order.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route POST /api/orders
 * @desc Create new order from cart items
 * @access Private
 * @body {Array} items - Cart items
 * @body {number} shippingAddressId - Shipping address ID
 * @body {string} shippingMethod - Shipping method
 * @body {string} paymentMethod - Payment method
 * @body {string} specialInstructions - Special instructions (optional)
 * @body {string} giftMessage - Gift message (optional)
 * @body {string} discountCode - Discount code (optional)
 */
router.post('/', authenticateToken, createOrder);

/**
 * @route GET /api/orders/my
 * @desc Get user's orders
 * @access Private
 * @query {string} status - Filter by order status
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 */
router.get('/my', authenticateToken, getUserOrders);

/**
 * @route GET /api/orders/:id
 * @desc Get order details
 * @access Private (Users can only see their own orders, admins can see all)
 * @param {number} id - Order ID
 */
router.get('/:id', authenticateToken, getOrderById);

/**
 * @route GET /api/orders
 * @desc Get all orders (Admin only)
 * @access Private (Admin only)
 * @query {string} status - Filter by order status
 * @query {number} customerId - Filter by customer ID
 * @query {string} dateFrom - Filter orders from date (YYYY-MM-DD)
 * @query {string} dateTo - Filter orders to date (YYYY-MM-DD)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/', authenticateToken, requireAdmin, getAllOrders);

/**
 * @route PUT /api/orders/:id/status
 * @desc Update order status (Admin only)
 * @access Private (Admin only)
 * @param {number} id - Order ID
 * @body {string} status - New order status
 * @body {string} trackingNumber - Tracking number (optional)
 * @body {string} notes - Admin notes (optional)
 */
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

/**
 * @route POST /api/orders/:id/cancel
 * @desc Cancel order
 * @access Private (Users can cancel their own orders, admins can cancel any)
 * @param {number} id - Order ID
 * @body {string} reason - Cancellation reason
 */
router.post('/:id/cancel', authenticateToken, cancelOrder);

export default router;