import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { getProfile, updateProfile } from '../controllers/userController.js';

const router = express.Router();


router.get('/profile', protect, getProfile);

router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;
