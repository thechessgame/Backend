import { ContactUs } from "../models/contactus.models.js";

import { sendMail } from "../services/mailer.js";

import { emailHtml } from "../configs/constants.js";

export const postMail = async (req, res, next) => {
    const { email, name, comment } = req.body;
    try {
        const contactUs = new ContactUs({ email, name, comment })
        await contactUs.save()
        await sendMail(email, 'Contact Us', emailHtml.contactUs(name))
        res.created('Request save', null, 'Your Request successfully Send!')
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}