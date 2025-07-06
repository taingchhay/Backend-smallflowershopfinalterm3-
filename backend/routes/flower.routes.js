import express from 'express';
import { 
    getFlowers, 
    createFlower 
} from '../controllers/flower.controller';

const router = express.Router();

router.get('/', getFlowers);
router.post('/', createFlower);

export default router;