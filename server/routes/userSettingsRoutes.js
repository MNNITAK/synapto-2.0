import express from 'express';
import { updateProfileImage, updateDetails } from '../controllers/userController.js';
import upload from '../middlewares/multer.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.patch("/profile-image", protect, upload.single("image"), updateProfileImage);
router.patch("/update-details", protect, updateDetails);

export default router;

