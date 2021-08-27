import express from "express";

const router = express.Router();

import * as userControler from "../controlers/user.controlers.js";

import { validationMiddleware } from "../middleware/validation.js";
import { schemas } from "../services/validation.js";

router.get(
    '/checkusername',
    userControler.checkUserName
);

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