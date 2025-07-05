import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, authorize('user'), createOrder);
router.get('/my', authenticate, authorize('user'), getUserOrders);
router.get('/all', authenticate, authorize('admin'), getAllOrders);

export default router;