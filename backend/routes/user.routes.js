import { Router } from "express";
import * as userController from '../controllers/user.controllers.js';
import {body} from 'express-validator'
import * as authMiddleware from '../middleware/auth.middleware.js'
const router=Router();

router.post('/register', 
    body('email').isEmail().withMessage('Email must be a valid Email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    userController.createUserController
);
router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid Email'),
    body('password').exists().withMessage('Password is required'),
    userController.loginUserController
);
router.get('/profile', authMiddleware.authUser, userController.profileController);
router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUsers);
export default router;