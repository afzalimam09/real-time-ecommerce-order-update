import express from "express";

import homeRoute from './home/homeRoute.js';
import authRoute from './auth/authRoute.js';
import cartRoute from './cart/cartRoute.js';
import adminRoute from './admin/adminRoute.js';
import orderRoute from './order/orderRoute.js';

const router = express.Router();

router.use(homeRoute);
router.use(authRoute);
router.use(cartRoute);
router.use('/admin', adminRoute);
router.use(orderRoute);

export default router;