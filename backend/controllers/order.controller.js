/**
 * Order Controller - Order Management
 *
 * This controller handles all order-related operations including
 * order creation, retrieval, status updates, and order history.
 *
 * Features:
 * - Create orders from cart items
 * - Get user order history
 * - Get order details
 * - Update order status (admin)
 * - Order tracking and notifications
 * - Order analytics
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import models from '../models/index.js';
import { Op } from 'sequelize';

const { Order, OrderItem, Flower, User, ShippingAddress } = models;

/**
 * Create new order from cart items
 *
 * @route POST /api/orders
 * @access Private
 * @body {Object} orderData - Order information
 * @body {Array} orderData.items - Cart items
 * @body {number} orderData.shippingAddressId - Shipping address ID
 * @body {string} orderData.shippingMethod - Shipping method
 * @body {string} orderData.paymentMethod - Payment method
 * @body {string} orderData.specialInstructions - Special instructions
 * @body {string} orderData.giftMessage - Gift message
 */
export const createOrder = async (req, res) => {
    const transaction = await models.sequelize.transaction();

    try {
        const userId = req.user.id;
        const {
            items,
            shippingAddressId,
            shippingMethod = 'standard',
            paymentMethod,
            specialInstructions,
            giftMessage,
            discountCode
        } = req.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Order must contain at least one item'
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                message: 'Payment method is required'
            });
        }

        // Verify shipping address belongs to user
        if (shippingAddressId) {
            const shippingAddress = await ShippingAddress.findOne({
                where: { id: shippingAddressId, userId }
            });

            if (!shippingAddress) {
                return res.status(400).json({
                    message: 'Invalid shipping address'
                });
            }
        }

        // Validate and calculate order totals
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const { flowerId, quantity } = item;

            if (!flowerId || !quantity || quantity <= 0) {
                return res.status(400).json({
                    message: 'Invalid item data'
                });
            }

            const flower = await Flower.findByPk(flowerId);
            if (!flower) {
                return res.status(400).json({
                    message: `Product not found: ${flowerId}`
                });
            }

            if (!flower.isAvailable()) {
                return res.status(400).json({
                    message: `Product not available: ${flower.name}`
                });
            }

            if (flower.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${flower.name}. Available: ${flower.stock}`
                });
            }

            const itemTotal = parseFloat(flower.price) * quantity;
            subtotal += itemTotal;

            validatedItems.push({
                flower,
                quantity,
                unitPrice: flower.price,
                totalPrice: itemTotal
            });
        }

        // Calculate shipping cost (simplified)
        const shippingCost = calculateShippingCost(shippingMethod, subtotal);

        // Calculate tax (8% for example)
        const taxRate = 0.08;
        const taxAmount = (subtotal + shippingCost) * taxRate;

        // Apply discount if provided
        let discountAmount = 0;
        if (discountCode) {
            discountAmount = calculateDiscount(discountCode, subtotal);
        }

        const total = subtotal + shippingCost + taxAmount - discountAmount;

        // Create order
        const orderData = {
            userId,
            subtotal: subtotal.toFixed(2),
            shippingCost: shippingCost.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            total: total.toFixed(2),
            shippingAddressId,
            shippingMethod,
            paymentMethod,
            specialInstructions,
            giftMessage,
            discountCode
        };

        const order = await Order.create(orderData, { transaction });

        // Create order items and update stock
        for (const item of validatedItems) {
            await OrderItem.create({
                orderId: order.id,
                flowerId: item.flower.id,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                flowerName: item.flower.name,
                flowerDescription: item.flower.description,
                flowerImage: item.flower.image,
                flowerCategory: item.flower.category,
                flowerSku: item.flower.sku
            }, { transaction });

            // Reduce stock
            await item.flower.reduceStock(item.quantity);
        }

        await transaction.commit();

        // Fetch complete order with items
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                },
                {
                    model: ShippingAddress,
                    as: 'shippingAddress'
                }
            ]
        });

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                ...completeOrder.toJSON(),
                formattedTotal: completeOrder.getFormattedTotal(),
                statusDisplay: completeOrder.getStatusDisplay(),
                paymentStatusDisplay: completeOrder.getPaymentStatusDisplay()
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Create order error:', error);
        res.status(500).json({
            message: 'Failed to create order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get user's orders
 *
 * @route GET /api/orders/my
 * @access Private
 * @query {string} status - Filter by order status
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 */
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const whereClause = { userId };
        if (status) {
            whereClause.status = status;
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset,
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    attributes: ['id', 'quantity', 'unitPrice', 'totalPrice', 'flowerName', 'flowerImage']
                }
            ]
        });

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            orders: orders.map(order => ({
                ...order.toJSON(),
                formattedTotal: order.getFormattedTotal(),
                statusDisplay: order.getStatusDisplay(),
                paymentStatusDisplay: order.getPaymentStatusDisplay(),
                itemCount: order.items.length
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                pages: totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get order details
 *
 * @route GET /api/orders/:id
 * @access Private
 * @param {number} id - Order ID
 */
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const whereClause = { id };
        if (!isAdmin) {
            whereClause.userId = userId; // Users can only see their own orders
        }

        const order = await Order.findOne({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Flower,
                            as: 'flower',
                            attributes: ['id', 'name', 'status', 'stock']
                        }
                    ]
                },
                {
                    model: ShippingAddress,
                    as: 'shippingAddress'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.json({
            ...order.toJSON(),
            formattedTotal: order.getFormattedTotal(),
            statusDisplay: order.getStatusDisplay(),
            paymentStatusDisplay: order.getPaymentStatusDisplay(),
            canBeCancelled: order.canBeCancelled(),
            canBeRefunded: order.canBeRefunded(),
            items: order.items.map(item => ({
                ...item.toJSON(),
                formattedUnitPrice: item.getFormattedUnitPrice(),
                formattedTotalPrice: item.getFormattedTotalPrice()
            }))
        });

    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({
            message: 'Failed to fetch order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get all orders (Admin only)
 *
 * @route GET /api/orders
 * @access Private (Admin)
 * @query {string} status - Filter by order status
 * @query {number} customerId - Filter by customer ID
 * @query {string} dateFrom - Filter orders from date (YYYY-MM-DD)
 * @query {string} dateTo - Filter orders to date (YYYY-MM-DD)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
export const getAllOrders = async (req, res) => {
    try {
        const {
            status,
            customerId,
            dateFrom,
            dateTo,
            page = 1,
            limit = 20
        } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (customerId) {
            whereClause.userId = parseInt(customerId);
        }

        if (dateFrom || dateTo) {
            whereClause.createdAt = {};
            if (dateFrom) whereClause.createdAt[Op.gte] = new Date(dateFrom);
            if (dateTo) whereClause.createdAt[Op.lte] = new Date(dateTo + ' 23:59:59');
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    attributes: ['id', 'quantity', 'totalPrice']
                }
            ]
        });

        const totalPages = Math.ceil(count / limitNum);

        // Calculate summary statistics
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

        res.json({
            orders: orders.map(order => ({
                ...order.toJSON(),
                formattedTotal: order.getFormattedTotal(),
                statusDisplay: order.getStatusDisplay(),
                paymentStatusDisplay: order.getPaymentStatusDisplay(),
                itemCount: order.items.length,
                customerName: order.user?.name || 'Unknown',
                customerEmail: order.user?.email
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                pages: totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            },
            summary: {
                totalOrders: count,
                totalRevenue: totalRevenue.toFixed(2),
                averageOrderValue: count > 0 ? (totalRevenue / count).toFixed(2) : '0.00'
            }
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update order status (Admin only)
 *
 * @route PUT /api/orders/:id/status
 * @access Private (Admin)
 * @param {number} id - Order ID
 * @body {string} status - New order status
 * @body {string} trackingNumber - Tracking number (optional)
 * @body {string} notes - Admin notes (optional)
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trackingNumber, notes } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        await order.updateStatus(status, { trackingNumber, notes });

        res.json({
            message: 'Order status updated successfully',
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                trackingNumber: order.trackingNumber,
                statusDisplay: order.getStatusDisplay()
            }
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            message: 'Failed to update order status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Cancel order
 *
 * @route POST /api/orders/:id/cancel
 * @access Private
 * @param {number} id - Order ID
 * @body {string} reason - Cancellation reason
 */
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const whereClause = { id };
        if (!isAdmin) {
            whereClause.userId = userId; // Users can only cancel their own orders
        }

        const order = await Order.findOne({ where: whereClause });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        await order.cancel(reason || 'Cancelled by user');

        res.json({
            message: 'Order cancelled successfully',
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                statusDisplay: order.getStatusDisplay()
            }
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            message: 'Failed to cancel order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Helper function to calculate shipping cost
 */
function calculateShippingCost(shippingMethod, subtotal) {
    const shippingRates = {
        standard: 5.99,
        express: 12.99,
        overnight: 24.99,
        pickup: 0
    };

    let cost = shippingRates[shippingMethod] || shippingRates.standard;

    // Free shipping over $75
    if (subtotal >= 75) {
        cost = 0;
    }

    return cost;
}

/**
 * Helper function to calculate discount
 */
function calculateDiscount(discountCode, subtotal) {
    const discounts = {
        'WELCOME10': 0.10, // 10% off
        'SAVE20': 0.20,    // 20% off
        'FREESHIP': 5.99   // Free shipping value
    };

    const discountRate = discounts[discountCode.toUpperCase()];
    if (!discountRate) return 0;

    if (discountCode.toUpperCase() === 'FREESHIP') {
        return discountRate; // Fixed amount
    }

    return subtotal * discountRate; // Percentage discount
}