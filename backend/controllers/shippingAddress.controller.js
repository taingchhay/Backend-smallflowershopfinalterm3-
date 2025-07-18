/**
 * Shipping Address Controller - Address Management
 * 
 * This controller handles all shipping address operations including
 * CRUD operations for user addresses, default address management,
 * and address validation.
 * 
 * Features:
 * - Get user addresses
 * - Create new address
 * - Update existing address
 * - Delete address
 * - Set default address
 * - Address validation
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import models from '../models/index.js';

const { ShippingAddress } = models;

/**
 * Get user's shipping addresses
 * 
 * @route GET /api/addresses
 * @access Private
 */
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const addresses = await ShippingAddress.getByUser(userId);

        res.json({
            addresses: addresses.map(address => address.getSummary())
        });

    } catch (error) {
        console.error('Get user addresses error:', error);
        res.status(500).json({
            message: 'Failed to fetch addresses',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get single address
 * 
 * @route GET /api/addresses/:id
 * @access Private
 * @param {number} id - Address ID
 */
export const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const address = await ShippingAddress.findOne({
            where: { id, userId }
        });

        if (!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }

        res.json(address.getSummary());

    } catch (error) {
        console.error('Get address by ID error:', error);
        res.status(500).json({
            message: 'Failed to fetch address',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Create new shipping address
 * 
 * @route POST /api/addresses
 * @access Private
 * @body {Object} addressData - Address information
 * @body {string} addressData.recipientName - Recipient name
 * @body {string} addressData.addressLine1 - Primary address line
 * @body {string} addressData.addressLine2 - Secondary address line (optional)
 * @body {string} addressData.city - City
 * @body {string} addressData.state - State/Province
 * @body {string} addressData.postalCode - Postal/ZIP code
 * @body {string} addressData.country - Country (optional, defaults to United States)
 * @body {string} addressData.phone - Phone number (optional)
 * @body {boolean} addressData.isDefault - Set as default address (optional)
 * @body {string} addressData.addressType - Address type (optional)
 * @body {string} addressData.deliveryInstructions - Delivery instructions (optional)
 */
export const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressData = {
            ...req.body,
            userId
        };

        // Input validation
        const requiredFields = ['recipientName', 'addressLine1', 'city', 'state', 'postalCode'];
        const missingFields = requiredFields.filter(field => !addressData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missingFields
            });
        }

        const address = await ShippingAddress.create(addressData);

        res.status(201).json({
            message: 'Address created successfully',
            address: address.getSummary()
        });

    } catch (error) {
        console.error('Create address error:', error);
        
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
            message: 'Failed to create address',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update shipping address
 * 
 * @route PUT /api/addresses/:id
 * @access Private
 * @param {number} id - Address ID
 * @body {Object} updateData - Updated address information
 */
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        const address = await ShippingAddress.findOne({
            where: { id, userId }
        });

        if (!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }

        await address.update(updateData);

        res.json({
            message: 'Address updated successfully',
            address: address.getSummary()
        });

    } catch (error) {
        console.error('Update address error:', error);
        
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
            message: 'Failed to update address',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Delete shipping address
 * 
 * @route DELETE /api/addresses/:id
 * @access Private
 * @param {number} id - Address ID
 */
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const address = await ShippingAddress.findOne({
            where: { id, userId }
        });

        if (!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }

        // Check if this is the only address
        const addressCount = await ShippingAddress.count({
            where: { userId }
        });

        if (addressCount === 1) {
            return res.status(400).json({
                message: 'Cannot delete the only address. Please add another address first.'
            });
        }

        await address.destroy();

        res.json({
            message: 'Address deleted successfully'
        });

    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({
            message: 'Failed to delete address',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Set default address
 * 
 * @route POST /api/addresses/:id/default
 * @access Private
 * @param {number} id - Address ID
 */
export const setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const address = await ShippingAddress.findOne({
            where: { id, userId }
        });

        if (!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }

        await address.setAsDefault();

        res.json({
            message: 'Default address updated successfully',
            address: address.getSummary()
        });

    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({
            message: 'Failed to set default address',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get user's default address
 * 
 * @route GET /api/addresses/default
 * @access Private
 */
export const getDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        const address = await ShippingAddress.getDefaultByUser(userId);

        if (!address) {
            return res.status(404).json({
                message: 'No default address found'
            });
        }

        res.json(address.getSummary());

    } catch (error) {
        console.error('Get default address error:', error);
        res.status(500).json({
            message: 'Failed to fetch default address',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Validate delivery area
 * 
 * @route POST /api/addresses/validate
 * @access Public
 * @body {string} postalCode - Postal code to validate
 */
export const validateDeliveryArea = async (req, res) => {
    try {
        const { postalCode } = req.body;

        if (!postalCode) {
            return res.status(400).json({
                message: 'Postal code is required'
            });
        }

        const isValid = await ShippingAddress.validateDeliveryArea(postalCode);

        res.json({
            postalCode,
            isDeliveryAvailable: isValid,
            message: isValid ? 'Delivery available in this area' : 'Delivery not available in this area'
        });

    } catch (error) {
        console.error('Validate delivery area error:', error);
        res.status(500).json({
            message: 'Failed to validate delivery area',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
