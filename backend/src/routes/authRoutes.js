import { Router } from 'express';
import { forgotPasswordValidations, loginValidations, registerValidations } from '../middlewares/validations/AuthValidations.js';
import { forgotPassword, login, register } from '../controllers/authControllers.js';

const router = Router();

router.post('/login', loginValidations , login);

router.post('/register',registerValidations , register);

router.post('/reset-password', forgotPasswordValidations , forgotPassword);


export default router;
