import express from 'express';
import { upload } from '../middlewares/multer.js';
import {
  addProduct,
  changeStock,
  listProduct,
  singleProduct,
} from '../controllers/productController.js';
import adminAuth from '../middlewares/adminAuth.js';

const productRouter = express.Router();

productRouter.post(
  '/add-product',
  upload.array('images'),
  adminAuth,
  addProduct
);
productRouter.get('/list', listProduct);
productRouter.post('/single', adminAuth, singleProduct);
productRouter.post('/stock', adminAuth, changeStock);

export default productRouter;
