import express from "express";

const router = express.Router();

import * as contactUsControler from "../controlers/contactus.controlers.js";

import { isAuth } from "../middleware/is-auth.js";

import { validationMiddleware } from "../middleware/validation.js";
import { schemas } from "../services/validation.js";

router.post('', 
    isAuth,
    validationMiddleware(schemas.blogSendingMail),
    contactUsControler.postMail);

export default router;