import { emailConstants } from "../configs/constants.js";

import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

export const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport(sendgridTransport({
      auth: {
        api_key:
          emailConstants.EMAIL_API_KEY
      }
    }));
    await transporter.sendMail({
      to,
      from: emailConstants.EMAIL,
      subject,
      html,
    })
    return true
  } catch (error) {
    return false
  }
}