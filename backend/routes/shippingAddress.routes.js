import express from 'express';

import { getShippingAddresses, createShippingAddress, deleteShippingAddress, getShippingAddressLabels } from '../controllers/shippingAddress.controller.js';

const router = express.Router();

router.get('/:id', getShippingAddresses);
router.post('/', createShippingAddress);
router.delete('/:id', deleteShippingAddress);
router.get('/address-labels/:id', getShippingAddressLabels);

export default router;