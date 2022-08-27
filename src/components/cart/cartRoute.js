import express from 'express';

import { addToCart, deleteFromCart, getCartPage } from './cartController.js';

const router = express.Router();

router.get('/cart', getCartPage);

router.post('/add-to-cart', addToCart);

router.post('/delete-from-cart', deleteFromCart);

export default router;