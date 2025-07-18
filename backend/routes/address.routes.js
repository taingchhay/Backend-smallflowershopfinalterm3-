/**
 * Shipping Address Routes
 * 
 * This file defines all shipping address-related routes including
 * CRUD operations for user addresses and address validation.
 * 
 * Routes:
 * - GET / - Get user addresses
 * - GET /default - Get default address
 * - GET /:id - Get single address
 * - POST / - Create new address
 * - PUT /:id - Update address
 * - DELETE /:id - Delete address
 * - POST /:id/default - Set default address
 * - POST /validate - Validate delivery area
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import express from 'express';
import {
    getUserAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    validateDeliveryArea
} from '../controllers/shippingAddress.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/addresses
 * @desc Get user's shipping addresses
 * @access Private
 */
router.get('/', authenticateToken, getUserAddresses);

/**
 * @route GET /api/addresses/default
 * @desc Get user's default address
 * @access Private
 */
router.get('/default', authenticateToken, getDefaultAddress);

/**
 * @route GET /api/addresses/:id
 * @desc Get single address
 * @access Private
 * @param {number} id - Address ID
 */
router.get('/:id', authenticateToken, getAddressById);

/**
 * @route POST /api/addresses
 * @desc Create new shipping address
 * @access Private
 * @body {string} recipientName - Recipient name
 * @body {string} addressLine1 - Primary address line
 * @body {string} addressLine2 - Secondary address line (optional)
 * @body {string} city - City
 * @body {string} state - State/Province
 * @body {string} postalCode - Postal/ZIP code
 * @body {string} country - Country (optional)
 * @body {string} phone - Phone number (optional)
 * @body {boolean} isDefault - Set as default address (optional)
 * @body {string} addressType - Address type (optional)
 * @body {string} deliveryInstructions - Delivery instructions (optional)
 */
router.post('/', authenticateToken, createAddress);

/**
 * @route PUT /api/addresses/:id
 * @desc Update shipping address
 * @access Private
 * @param {number} id - Address ID
 * @body {Object} updateData - Updated address information
 */
router.put('/:id', authenticateToken, updateAddress);

/**
 * @route DELETE /api/addresses/:id
 * @desc Delete shipping address
 * @access Private
 * @param {number} id - Address ID
 */
router.delete('/:id', authenticateToken, deleteAddress);

/**
 * @route POST /api/addresses/:id/default
 * @desc Set default address
 * @access Private
 * @param {number} id - Address ID
 */
router.post('/:id/default', authenticateToken, setDefaultAddress);

/**
 * @route POST /api/addresses/validate
 * @desc Validate delivery area
 * @access Public
 * @body {string} postalCode - Postal code to validate
 */
router.post('/validate', validateDeliveryArea);

export default router;