import Joi from "joi";
import mongoose from "mongoose";

const type = {
    userName: Joi.string()
        .required()
        .trim(),
    name: Joi.string().trim(),
    otp: Joi.string().required().min(4).message("otp must contain atleast 4 digit"),
    password: Joi.string()
        .required()
        .pattern(
            new RegExp(
                "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[@#$%^&+=])"
            )
        )
        .message(
            "Password must cantain 8-20 Characters ,at least 1 in LowerCase,at least 1 With UpperCase and atleast 1 Special Character"
        ),
    confirmPassword: Joi.any().valid(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match with password' }),
    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2 })
        .message("Please enter a valid email address")
        .normalize(),
    contactNumber: Joi.string()
        .min(10)
        .message("Contact number must contain 10 digit🙄"),
    Id: Joi.string()
        .required()
        .custom((value, helper) => {
            if (mongoose.Types.ObjectId.isValid(value)) { return true }
            else { return helper.message("Need a valid userId") }
        }),
    requireString: Joi.string().required(),
    notRequireString: Joi.string(),
    requireBoolean: Joi.boolean().required(),
    notRequireBoolean: Joi.boolean(),
    requireObject: Joi.object().required()
}

export const schemas = {
    blogOtpRequest: Joi.object().keys({
        userName: type.userName,
        email: type.email,
        password: type.password,
        confirmPassword: type.confirmPassword
    }),
    blogUserSignin: Joi.object().keys({
        email: type.email,
        password: type.password
    }),
    blogResendOtp: Joi.object().keys({
        userId: type.Id
    }),
    blogConfirmOtp: Joi.object().keys({
        userId: type.Id,
        otp: type.otp
    }),
    blogEditUserDetails: Joi.object().keys({
        name: type.name,
        email: type.email,
        contact: type.contactNumber
    }),
    blogforgetPasswordOtpRequest: Joi.object().keys({
        email: type.email
    }),
    blogforgetPasswordConfirmOtp: Joi.object().keys({
        userId: type.Id,
        otpId: type.Id,
        otp: type.otp,
        password: type.password,
        confirmPassword: type.confirmPassword
    }),
    blogforgetPasswordResendOtp: Joi.object().keys({
        userId: type.Id,
        otpId: type.Id
    }),

    blogEditName: Joi.object().keys({
        name: type.requireString
    }),
    blogEditEmailOtprequest: Joi.object().keys({
        email: type.email
    }),
    blogEditEmailConfirmOtp: Joi.object().keys({
        otpId: type.Id,
        otp: type.otp
    }),

    blogquestionreply: Joi.object().keys({
        reply: type.requireString,
        questionId: type.Id
    }),
    blogeditreply: Joi.object().keys({
        reply: type.requireString,
        replyId: type.Id
    }),
    blogaskquestion: Joi.object().keys({
        subject: type.requireString,
        question: type.requireString
    }),
    blogeditquestion: Joi.object().keys({
        subject: type.requireString,
        question: type.requireString
    }),
    blogQuestionId: Joi.object().keys({
        questionId: type.Id
    }),
    blogReplyId: Joi.object().keys({
        replyId: type.Id
    }),


    blogUserName: Joi.object().keys({
        userName: type.userName
    }),
    blogSendRequestToPlay: Joi.object().keys({
        userName: type.userName,
    }),
    blogSendResponse: Joi.object().keys({
        userName: type.userName,
        accept: type.notRequireBoolean,
        request: type.notRequireBoolean,
        drawRequest: type.notRequireBoolean,
        pauseRequest: type.notRequireBoolean
    }),
    blogCreatedBoard: Joi.object().keys({
        player_1: type.userName,
        player_2: type.userName
    }),
    blogBoardData: Joi.object().keys({
        piece: type.requireObject,
        position: type.requireString,
        apponent: type.userName,
    }),

    blogSendingMail: Joi.object().keys({
        name: type.requireString,
        email: type.email,
        comment: type.requireString
    })
}