import { User } from "../models/user.models.js";

import { Otp } from "../models/otp.models.js";

import { hashSync, compareSync } from "bcrypt-nodejs";

import { sendMail } from "../services/mailer.js";
import { emailHtml } from "../configs/constants.js";

import { deleteUserImage } from "../configs/multer.js"

export const userProfile = async (req, res, next) => {
    const userName = req.userName;
    try {
        const user = await User.findOne({ userName });
        res.success(`User fetched!`, { userData: user }, `User fetched!`)
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const fetchName = async (req, res, next) => {
    const { userName } = req;
    try {
        const user = await User.findOne({ userName }).select("name");
        res.success(`Name fetched`, { name: user.name }, `Name fetched`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const editName = async (req, res, next) => {
    const { userName } = req;
    const { name } = req.body;
    try {
        await User.findOneAndUpdate({ userName }, { name });
        res.success(`Name updated`, { name }, `Name updated`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const fetchEmail = async (req, res, next) => {
    const { userName } = req;
    try {
        const user = await User.findOne({ userName }).select("email");
        res.success(`Email fetched`, { email: user.email }, `Email fetched`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const editEmailOtpRequest = async (req, res, next) => {
    const { userName } = req;
    const { email } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.warning('Email already Exist', null, 'This email is not available. Please try another!');
        }
        const user = await User.findOne({ userName });
        const otp = Math.floor(1000 + Math.random() * 9000);
        let userOtpData = await Otp.findOne({ email });
        if (userOtpData) {
            Object.assign(userOtpData, { userName: user.userName, email, password: user.password, otp: hashSync(otp) })
        }
        else {
            userOtpData = new Otp({ userName: user.userName, email, password: user.password, otp: hashSync(otp) });
        }
        await sendMail(email, 'OTP', emailHtml.otp(otp));
        await userOtpData.save();
        res.success(`mail send`, { otpId: userOtpData._id.toString() }, `OTP send on your new email!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const editEmailConfirmOtp = async (req, res, next) => {
    const { otpId, otp } = req.body;
    try {
        const userOtpData = await Otp.findById(otpId.toString());
        if (!userOtpData) {
            return res.warning("No request found", null, "No request found");
        }
        if (userOtpData.updatedAt.getTime() + (3 * 60 * 1000) < new Date()) {
            return res.warning(`Otp has been exipired!`, null, `Otp has been exipired!`)
        }
        if (!compareSync(otp, userOtpData.otp)) {
            return res.unauthorizedUser("Incorrect Otp");
        }
        await User.findOneAndUpdate({ userName: req.userName }, { email: userOtpData.email });
        await Otp.findByIdAndDelete(otpId.toString());
        return res.success("Email changed", null, "Your Email updated");
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
};

export const editProfileImg = async (req, res, next) => {
    const imageFile = req.file;
    const userName = req.userName;
    try {
        const user = await User.findOne({ userName });
        if (!imageFile) {
            return res.warning(`Img not given!`, { userData: user }, `Need img to update`)
        }
        const imageUrl = imageFile.destination + '/' + imageFile.filename;
        user.imageUrl = imageUrl
        await user.save();
        res.success(`Img successfully edited`, { userData: user }, `Img successfully edited`)
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const fetchContactNumber = async (req, res, next) => {
    const { userName } = req;
    try {
        const user = await User.findOne({ userName }).select("contactNumber");
        res.success(`contactNumber fetched`, { contactNumber: user.contactNumber }, `contactNumber fetched`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
}

export const deleteImg = async (req, res, next) => {
    const userName = req.userName;
    try {
        const user = await User.findOne({ userName });
        if (user.imageUrl !== 'images/blank-profile.png') {
            const err = deleteUserImage(user.imageUrl);
            if (err) {
                return res.error(err, null, `Something went wrong, Please try again later!`);
            }
        }
        user.imageUrl = 'images/blank-profile.png';
        await user.save();
        res.success(`Image Delete`, { imageUrl: user.imageUrl }, `Image Delete`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Please try again later!`);
    }
};