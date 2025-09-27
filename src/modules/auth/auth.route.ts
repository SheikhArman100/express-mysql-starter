import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { FileUploadHelper } from '../../helpers/fileUploadHelpers';
import formDataToJson from '../../middleware/formDataToJson';




const router = express.Router();


//signup and email verification routes  
router.post('/signup',FileUploadHelper.uploadSingle('users'),formDataToJson, validateRequest(AuthValidation.SignupSchema), AuthController.signup),
router.put('/verify-email',validateRequest(AuthValidation.verifyEmailSchema),AuthController.verifyEmail),
router.post('/resend-verification', validateRequest(AuthValidation.resendVerificationSchema), AuthController.resendVerification)


//signin
router.post('/signin', validateRequest(AuthValidation.SigninSchema), AuthController.signin);    



router.get('/token', AuthController.updateToken);
router.post('/signout', AuthController.signOut);

router.get('/user', AuthController.checkUser);

    

export const authRoute = router;
