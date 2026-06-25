import { Router } from 'express';
import { createUser } from '../controllers/userControllers.js';
import { authUser } from '../middlewares/Auth.js';
import { createUserValidation } from '../middlewares/validations/userValidations.js';

const router = Router();


router.post('/create',createUserValidation, authUser, createUser);


export default router;
