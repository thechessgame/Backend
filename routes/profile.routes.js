import express from "express";

const router = express.Router();

import * as userControler from "../controlers/profile.controlers.js";

import { isAuth } from "../middleware/is-auth.js";

import { validationMiddleware } from "../middleware/validation.js";
import { schemas } from "../services/validation.js";

import { uploadUserImage } from "../configs/multer.js";

router.get('/', isAuth, userControler.userProfile);

router.patch(
    '/edit/profileImg',
    isAuth,
    uploadUserImage,
    userControler.editProfileImg);

router.get(
    '/name',
    isAuth,
    userControler.fetchName);

router.patch(
    '/name',
    isAuth,
    validationMiddleware(schemas.blogEditName),
    userControler.editName);

router.get(
    '/email',
    isAuth,
    userControler.fetchEmail);

router.delete('/deleteImage', isAuth, userControler.deleteImg);

export default router;