import models from '../models/index.js';

export const addFlowerToCart = async (req, res) => {
    const { flower, userId, quantity } = req.body;

    try {
        const addToCart = await models.Cart.create({
            userId,
            flowerId: flower.id,
            quantity,
            unit_price: flower.price
        });

        res.status(200).json({ success: true, message: 'Flower added to cart successfully' });

    } catch (error) {
        console.log('Error in addFlowerToCart:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getCartItems = async (req, res) => {
    const { id } = req.params;

    try {
        const cartItems = await models.Cart.findAll({
            where: {
                userId: id
            },
            include: {
                model: models.Flower,
                as: 'flower',
                attributes: {
                    exclude: []
                }
            }
        });

        if (!cartItems) {
            return res.status(404).json({ success: true, message: 'No Items Found' });
        }

        res.status(200).json({ success: true, data: cartItems });
    } catch (error) {
        console.log('Error in getCartItems:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getCartQuantity = async (req, res) => {
    const { id } = req.params;

    try {
        const itemQuantity = await models.Cart.count({
            where: { userId: id }
        });

        if (!itemQuantity) {
            return res.status(200).json({ success: true, data: 0 });
        }

        res.status(200).json({ success: true, data: itemQuantity });
    } catch (error) {
        console.log('Error in getCartQuantity:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};