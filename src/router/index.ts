import express from 'express';
import User from './userRouter';

const router = express.Router();
router.use('/', User);

export default router;
