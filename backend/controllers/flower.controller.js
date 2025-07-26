import model from '../models/index.js';

export const getAllFlowers = async (req, res) => {
    try {
        const flowers = await model.Flower.findAll();

        res.status(200).json({ success: true, data: flowers });
    } catch (error) {
        console.log('Error in getAllFlowers:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};