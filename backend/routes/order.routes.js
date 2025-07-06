import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/order.controller';

const router = express.Router();

router.post('/', createOrder);
router.get('/my', getUserOrders);
router.get('/all', getAllOrders);

export default router;