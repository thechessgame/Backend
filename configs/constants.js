import dotenv from "dotenv";
dotenv.config();

export const constants = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export const emailConstants = {
    EMAIL_API_KEY: process.env.EMAIL_API_KEY,
    EMAIL: process.env.EMAIL
}

export const emailHtml = {
    contactUs: (name) => `<h1>Hello ${name}!</h1><br><h5>We have been received your requist. As soon as possible, we resolve it.</h5>`,
    otp: (otp) => `Your Otp is ${otp}. its validity is only for 3 min.`,
}