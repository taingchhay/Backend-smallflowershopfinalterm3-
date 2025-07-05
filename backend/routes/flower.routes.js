import express from 'express';
import { 
    getFlowers, 
    createFlower 
} from '../controllers/flower.controller';
import { 
    authenticate, 
    authorize 
} from '../middleware/auth';

const router = express.Router();

router.get('/', getFlowers);
router.post('/', authenticate, authorize('admin'), createFlower);

export default router;