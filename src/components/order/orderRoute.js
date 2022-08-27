import express from 'express';
import { getCheckout, getOrderHistory, getSingleOrder, orderPlaced, placeOrder } from './orderController.js';
import isAuth from '../../middleware/isAuth.js';

const router = express.Router();

router.get('/checkout', isAuth, getCheckout);
router.post('/place-order', isAuth, placeOrder);
router.get('/order-placed', isAuth, orderPlaced);
router.get('/orders', isAuth, getOrderHistory);
router.get('/order/:id', isAuth, getSingleOrder);

export default router;