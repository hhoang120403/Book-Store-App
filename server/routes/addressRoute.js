import express from 'express';
import { addAddress, getAddress } from '../controllers/addressController.js';
import userAuth from '../middlewares/userAuth.js';

const addressRouter = express.Router();

addressRouter.post('/add', userAuth, addAddress);
addressRouter.get('/get', userAuth, getAddress);

export default addressRouter;
