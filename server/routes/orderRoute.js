import express from 'express';
import adminAuth from '../middlewares/adminAuth.js';
import {
  allOrders,
  placeOrderCOD,
  placeOrderStripe,
  updateState,
  userOrders,
} from '../controllers/orderController.js';
import userAuth from '../middlewares/userAuth.js';

const orderRouter = express.Router();

// For admin
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/update-status', adminAuth, updateState);

// For payment
orderRouter.post('/cod', userAuth, placeOrderCOD);
orderRouter.post('/stripe', userAuth, placeOrderStripe);

// For user
orderRouter.get('/user-orders', userAuth, userOrders);

export default orderRouter;
