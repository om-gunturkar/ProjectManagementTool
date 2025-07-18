import express from 'express';
import { loginUser, registerUser, updatePassword, updateProfile, getCurrentUser } from '../controller/userController.js';
import authMiddleware from '../middleware/auth.js'

const userRouter = express.Router();

//Public Routes

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);

//Private Routes protect also

userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, updatePassword);

export default userRouter;