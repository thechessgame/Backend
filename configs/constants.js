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

export const firebaseServiceAccountConstants = {
    type: process.env.FIREBASE_ACCOUNT_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_x509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_x509_CERT_URL,
};

export const firebaseConstants = {
    FIREBASE_RT_DATABASE_URL: process.env.FIREBASE_RT_DATABASE_URL,
    FIREBASE_BUCKET_NAME: process.env.FIREBASE_BUCKET_NAME
}