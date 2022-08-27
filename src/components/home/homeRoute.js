import express from 'express';

import { getHomePage } from './homeController.js';

const router = express.Router();

router.get('/', getHomePage);

export default router;