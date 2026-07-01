import { Router } from 'express';
import { createUser, deleteUser, getAllReviewer, getAllUsers, updateUser } from '../controllers/userControllers.js';
import { authUser } from '../middlewares/Auth.js';
import { createUserValidation, deleteUserValidation, getAllUsersValidation, updateUserValidation } from '../middlewares/validations/userValidations.js';
import { allowedRoles } from '../middlewares/roleMiddlewares.js';

const router = Router();

router.get('/reviewers', authUser, getAllReviewer);
router.get('/get-all-users', getAllUsersValidation, authUser,  allowedRoles("admin"), getAllUsers);
router.post('/create',createUserValidation, authUser, allowedRoles("admin"), createUser);
router.post('/update/:id',updateUserValidation, authUser, allowedRoles("admin"), updateUser);
router.delete('/delete/:id',deleteUserValidation, authUser, allowedRoles("admin"), deleteUser);


export default router;
