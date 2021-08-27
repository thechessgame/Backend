import { User } from "../models/user.models.js";

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