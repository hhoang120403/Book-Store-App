import express from 'express';
import {
  adminLogin,
  adminLogout,
  isAdminAuth,
} from '../controllers/adminController.js';
import adminAuth from '../middlewares/adminAuth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/logout', adminLogout);
adminRouter.get('/is-auth', adminAuth, isAdminAuth);

export default adminRouter;
