import express from 'express';
import User from './user';

const router = express.Router();

router.use('/', User);

export default router;
