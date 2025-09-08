import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { addToCart, updateCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/add', userAuth, addToCart);
cartRouter.post('/update', userAuth, updateCart);

export default cartRouter;
