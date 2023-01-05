import express from 'express';
import Controllers from './controller';
import * as userValidator from '../middleware/validator/userValidator';
const router = express.Router();

const { UserController } = Controllers;

const usersPrefix = (path?: string) => `/users${path ? `/${path}` : ''}`;
const userPrefix = (path?: string) => `/user/${path ? `/${path}` : ''}`;

router.get(usersPrefix(':userid'), UserController.getUserById);
router.get(usersPrefix(), UserController.getUsers);
router.post(userPrefix(), userValidator.createUser, UserController.createUser);
router.put(userPrefix(), userValidator.updateUser, UserController.updateUser);
router.delete(userPrefix(), UserController.deleteUser);

export default router;
