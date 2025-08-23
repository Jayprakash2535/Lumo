import { Router } from "express";
import{body} from 'express-validator';
import * as authMiddleWare from '../middleware/auth.middleware.js'
import * as projectController from '../controllers/project.controllers.js';
const router=Router();

router.post('/create',authMiddleWare.authUser,
body('name').isString().withMessage('Name must be a string')
.isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
projectController.createProject);

router.get('/all',authMiddleWare.authUser,projectController.getAllProjects);
router.put('/add-user',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)

router.get('/get-project/:projectId', authMiddleWare.authUser, projectController.getProjectById);
    export default router;