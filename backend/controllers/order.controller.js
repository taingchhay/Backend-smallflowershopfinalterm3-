import Order from '../models/Order.model';

export const createOrder = async (req, res) => {
    try {
        const { items, total } = req.body;
        const order = new Order({ user: req.user.id, items, total });
        res.status(201).json(order);
    } catch (error) {
        console.log('Error in createOrder:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (error) {
        console.log('Error in getUserOrders:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.log('Error in getAllOrder:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};