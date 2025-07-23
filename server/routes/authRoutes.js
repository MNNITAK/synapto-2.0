import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import {googleLogin} from '../controllers/googleLoginController.js';
import { Passkey, PasskeyVerify ,PasskeyLogin,PasskeyVerifyLogin} from '../controllers/Passkey.js';
import {
    requestOtpReset,
    verifyOtp,
    resetPassword,
  } from "../controllers/authControllers.js";  

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post("/google-login", googleLogin);
router.post("/passkey", Passkey);
router.post('/passkey-verify', PasskeyVerify);
router.post('/passkey-login', PasskeyLogin);
router.post('/passkey-verify-login', PasskeyVerifyLogin);
router.post("/request-otp", requestOtpReset);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;