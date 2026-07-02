import { Router } from 'express';
import { forgotPasswordValidations, loginValidations, registerValidations, sendOtpValidation, verifyOtpValidation } from '../middlewares/validations/AuthValidations.js';
import { forgotPassword, login, register, sendOTP, verifyOTP } from '../controllers/authControllers.js';

const router = Router();

router.post('/login', loginValidations , login);
router.post('/register', registerValidations , register);
router.post('/reset-password', forgotPasswordValidations , forgotPassword);
router.post('/send-otp', sendOtpValidation , sendOTP);
router.post('/verify-otp', verifyOtpValidation , verifyOTP);


export default router;
