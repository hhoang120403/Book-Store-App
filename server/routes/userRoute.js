import express from 'express';
import {
  isAuth,
  userLogin,
  userLogout,
  userRegister,
} from '../controllers/userController.js';
import userAuth from '../middlewares/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);
userRouter.post('/logout', userLogout);
userRouter.get('/is-auth', userAuth, isAuth);

export default userRouter;
