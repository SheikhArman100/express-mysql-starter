import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';




const router = express.Router();

router.post('/signup', validateRequest(AuthValidation.SignupSchema), AuthController.signup),
router.put('/verify-email',validateRequest(AuthValidation.verifyEmailSchema),AuthController.verifyEmail)



router.get('/token', AuthController.updateToken);
router.post('/signout', AuthController.signOut);

router.get('/user', AuthController.checkUser);

    

export const authRoute = router;
