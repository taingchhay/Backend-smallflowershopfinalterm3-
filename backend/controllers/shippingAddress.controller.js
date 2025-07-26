import models from '../models/index.js';

export const getShippingAddresses = async (req, res) => {
    const { id } = req.params;

    try {
        const shippingAddresses = await models.ShippingAddress.findAll({
            where: { userId: id }
        });

        res.status(200).json({ success: true, data: shippingAddresses });
    } catch (error) {
        console.log('Error in getShippingAddresses:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createShippingAddress = async (req, res) => {
    const { street, city, commune, province, postalCode, country, label, userId } = req.body;
    try {
        const createAddress = await models.ShippingAddress.create({
            userId: userId,
            street,
            city,
            commune,
            province,
            postalCode,
            country,
            label
        });

        res.status(200).json({ success: true, message: 'Shipping Address Created Successfully', data: createAddress });
    } catch (error) {
        console.log('Error in createShippingAddress:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteShippingAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const rowAffected = await models.ShippingAddress.destroy({
            where: { id: id }
        });

        if (rowAffected === 0) {
            return res.status(404).json({ success: false, message: 'Shipping Address not Found' });
        }

        res.status(200).json({ success: true, message: 'Shipping Address Deleted Successfully' });
    } catch (error) {
        console.log('Error in deleteShippingAddress:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getShippingAddressLabels = async (req, res) => {
    const { id } = req.params;

    try {
        const shippingAddressLabels = await models.ShippingAddress.findAll({
            where: { userId: id },
            attributes: {
                exclude: ['postalCode', 'createdAt', 'updatedAt']
            }
        });

        if (!shippingAddressLabels) {
            return res.status(404).json({ success: true, message: 'No Shipping Addresses Found' });
        }

        res.status(200).json({ success: true, data: shippingAddressLabels });
    } catch (error) {
        console.log('Error in getShippingAddressesLabel:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};