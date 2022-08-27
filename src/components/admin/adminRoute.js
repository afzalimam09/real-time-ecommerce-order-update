import express from 'express';
import isAdmin from '../../middleware/isAdmin.js';

import { getAdminOrders, postAddProduct, updateAdminOrders } from './adminController.js';

const router = express.Router();

router.post('/add-product', isAdmin, postAddProduct);
router.get('/orders', isAdmin, getAdminOrders);
router.post('/order/status', isAdmin, updateAdminOrders);

export default router;