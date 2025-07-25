import express from 'express';

import { addFlowerToCart, getCartItems, getCartQuantity } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/', addFlowerToCart);
router.get('/:id', getCartItems);
router.get('/cart-quantity/:id', getCartQuantity);

export default router;