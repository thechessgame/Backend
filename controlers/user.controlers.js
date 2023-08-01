import { User } from "../models/user.models.js";
import { Otp } from "../models/otp.models.js";

import { constants, emailHtml } from "../configs/constants.js";

import jwt from "jsonwebtoken";

import { hashSync, compareSync } from "bcrypt-nodejs";

import { sendMail } from "../services/mailer.js";

// sendPasswordResetEmail
// while login with firebase
export const createUser = async (req, res, next) => {
    const { userName, email } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ userName }, { email }]
        });
        if (user) {
            return res.warning(`User already exist!`, null, `User already exist!`);
        }

        const newUser = new User({ email: email, userName: userName });
        await newUser.save();

        return res.created("Signup successfully", newUser, "You have been successfully signup");

    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};


export const getUser = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.success(`User doesn't exist!`, null, `User doesn't exist!`);
        }

        return res.created("Login successfully", user, "You have been successfully Login");
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};


export const checkUserName = async (req, res, next) => {
    const { userName } = req.query;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.success(`UserName doesn't exist!`, true, `UserName doesn't exist!`);
        } else {
            return res.warning(`UserName already exist!`, false, `UserName already exist!`);
        }
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};


// while login without firebase
export const otpRequest = async (req, res, next) => {
    const { userName, email, password } = req.body;
    try {
        const userNameExist = await User.findOne({ userName });
        if (userNameExist) {
            return res.warning(`UserName allready Exist!`, null, `UserName allready Exist!`);
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.warning(`User allready Exist!`, null, `This email allready Exist!, Plz try another!`);
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        let user = await Otp.findOne({ email });
        if (user) {
            Object.assign(user, { userName, email, password: hashSync(password), otp: hashSync(otp) })
        }
        else {
            user = new Otp({ userName, email, password: hashSync(password), otp: hashSync(otp) });
        }
        await user.save();
        const mailSend = await sendMail(email, "OTP", emailHtml.otp(otp));
        if (!mailSend) { res.error("email Not send", null, `Something went wrong, Plese try again later!`) }
        return res.created(`Otp send successfully`, { userId: user._id.toString() }, `Otp send on your email!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};

export const confirmOtp = async (req, res, next) => {
    const { userId, otp } = req.body;
    try {
        const userExist = await User.findById(userId.toString());
        if (userExist) {
            return res.warning(`User allready Exist`, null, `User allready Exist`);
        }
        const userOtpData = await Otp.findById(userId.toString());
        if (!userOtpData) {
            return res.warning("No request found", null, "No request found");
        }
        if (userOtpData.updatedAt.getTime() + (3 * 60 * 1000) < new Date()) {
            return res.warning(`Otp has been exipired!`, null, `Otp has been exipired!`)
        }
        if (!compareSync(otp, userOtpData.otp)) {
            return res.unauthorizedUser("Incorrect Otp");
        }
        const user = new User({ email: userOtpData.email, userName: userOtpData.userName, password: userOtpData.password });
        await user.save();
        await Otp.findByIdAndDelete(userId.toString());
        const jwtToken = jwt.sign({ userName: user.userName }, constants.JWT_SECRET, { expiresIn: '1d' });
        return res.created("Signup successfully", jwtToken, "You have been successfully signup");
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};

export const resendOtp = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const user = await Otp.findById(userId.toString());
        if (!user) {
            return res.warning(`User doesn't Exist`);
        }
        user.otp = hashSync(otp)
        await user.save();
        const mailSend = await sendMail(user.email, "OTP", emailHtml.otp(otp));
        if (!mailSend) { res.error("email Not send", null, `Something went wrong, Plese try again later!`) }
        return res.success(`New Otp send successfully`, null, `New otp send on your email!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};
export const forgetPasswordOtpRequest = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.warning(`User not found!`, null, `No user found with this email!`);
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        let userOtpData = await Otp.findOne({ email });
        if (userOtpData) {
            Object.assign(userOtpData, { userName: user.userName, email: user.email, password: user.password, otp: hashSync(otp) })
        }
        else {
            userOtpData = new Otp({ userName: user.userName, email: user.email, password: user.password, otp: hashSync(otp) });
        }
        await userOtpData.save();
        const mailSend = await sendMail(email, "OTP", emailHtml.otp(otp));
        if (!mailSend) { res.error("email Not send", null, `Something went wrong, Plese try again later!`) }
        return res.created(`New Otp send successfully`, { userId: user._id.toString(), otpId: userOtpData._id.toString() }, `Otp send on your email!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};
export const ConfirmOtpAndUpdatePassword = async (req, res, next) => {
    const { userId, otpId, otp, password } = req.body;
    try {
        const userExist = await User.findById(userId.toString());
        if (!userExist) {
            return res.success(`User doesn't Exist`);
        }
        const userOtpData = await Otp.findById(otpId.toString());
        if (!userOtpData) {
            return res.warning("No request found!");
        }
        if (userOtpData.updatedAt.getTime() + (3 * 60 * 1000) < new Date()) {
            return res.warning(`Otp has been exipired!`, userOtpData, `Otp has been exipired!`)
        }
        if (!compareSync(otp, userOtpData.otp)) {
            return res.warning("Incorrect Otp", null, "Incorrect Otp");
        }
        await User.findByIdAndUpdate(otpId.toString(), { password: hashSync(password) });
        await Otp.findByIdAndDelete(otpId.toString());
        return res.success("Password update successfully", null, "Your password update successfully!");
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};

export const forgetPasswordOtpResend = async (req, res, next) => {
    const { userId, otpId } = req.body;
    try {
        const userExist = await User.findById(userId.toString());
        if (!userExist) {
            return res.success(`User doesn't Exist`);
        }
        const userOtpData = await Otp.findById(otpId.toString());
        if (!userOtpData) {
            return res.warning("No request found!");
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        userOtpData.otp = hashSync(otp);
        await userOtpData.save();
        const mailSend = await sendMail(userExist.email, "OTP", emailHtml.otp(otp));
        if (!mailSend) { res.error("email Not send", null, `Something went wrong, Plese try again later!`) }
        return res.created(`New Otp send successfully`, null, `New Otp send on your email!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.warning(`No account found`, null, `There is not any account with this email Id!`)
        }
        if (!compareSync(password, user.password)) {
            return res.unauthorizedUser(`Password must be correct!`)
        }
        const jwtToken = jwt.sign({ userName: user.userName }, constants.JWT_SECRET, { expiresIn: '1d' });
        return res.success(`Sign In successfully!`, { jwtToken }, `Sign In successfully!`)
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};