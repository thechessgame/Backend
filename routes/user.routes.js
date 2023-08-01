import express from "express";

const router = express.Router();

import * as userControler from "../controlers/user.controlers.js";

import { validationMiddleware } from "../middleware/validation.js";
import { schemas } from "../services/validation.js";
import { isAuth } from "../middleware/is-auth.js";

// while login with firebase (new process)
router.post(
    '/createuser',
    isAuth,
    userControler.createUser
);

router.get(
    '/getuser',
    isAuth,
    userControler.getUser
);

router.get(
    '/checkusername',
    userControler.checkUserName
);

// while login without firebase (old process)
router.post(
    '/otprequest',
    validationMiddleware(schemas.blogOtpRequest),
    userControler.otpRequest);

router.post(
    '/confirmotp',
    validationMiddleware(schemas.blogConfirmOtp),
    userControler.confirmOtp);

router.post(
    '/resendotp',
    validationMiddleware(schemas.blogResendOtp),
    userControler.resendOtp
);

router.post(
    '/forgetpassword/otprequest',
    validationMiddleware(schemas.blogforgetPasswordOtpRequest),
    userControler.forgetPasswordOtpRequest
);

router.post(
    '/forgetpassword/confirmotp',
    validationMiddleware(schemas.blogforgetPasswordConfirmOtp),
    userControler.ConfirmOtpAndUpdatePassword
);

router.post(
    '/forgetpassword/otpresend',
    validationMiddleware(schemas.blogforgetPasswordResendOtp),
    userControler.forgetPasswordOtpResend
);

router.post(
    '/login',
    validationMiddleware(schemas.blogUserSignin),
    userControler.userLogin
);
export default router;