import express from 'express';
import Controllers from '../controller';
import * as userValidator from '../middleware/validator/userValidator';

const router = express.Router();

const { UserController } = Controllers;

// Create two helper functions for generating route paths for the users and user resources
const usersPrefix = (path?: string) => `/users${path ? `/${path}` : ''}`;
const userPrefix = (path?: string) => `/user${path ? `/${path}` : ''}`;

router.get(userPrefix(':userid'), UserController.getUserById);

router.get(usersPrefix(), UserController.getUsers);

router.post(userPrefix(), userValidator.createUser, UserController.createUser);

router.put(userPrefix(), userValidator.updateUser, UserController.updateUser);

router.delete(userPrefix(':userid'), UserController.deleteUser);

export default router;
