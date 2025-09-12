import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../utils/catchError.js';

export const userRouter = new express.Router();

userRouter.put('/name', authMiddleware, catchError(userController.updateName));

userRouter.put(
  '/email',
  authMiddleware,
  catchError(userController.updateEmail),
);

userRouter.put(
  '/password',
  authMiddleware,
  catchError(userController.updatePassword),
);
