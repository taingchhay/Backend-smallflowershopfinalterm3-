import Flower from '../models/Flower.model';

export const getFlowers = async (req, res) => {
    try {
        const flowers = await Flower.find();
        res.json(flowers);
    } catch (error) {
        console.log('Error in getFlowers:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createFlower = async (req, res) => {
    try {
        const { name, description, price, image, stock } = req.body;
        const flower = new Flower({ name, description, price, image, stock });
        await flower.save();
        res.status(201).json(flower);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};