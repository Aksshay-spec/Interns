import express from 'express';
import upload from '../middleware/upload.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', upload.single('profileImage'), register);

router.post('/login', login);

export default router;
