import express from 'express';

import { getAllFlowers } from '../controllers/flower.controller.js';

const router = express.Router();

router.get('/', getAllFlowers);

export default router;