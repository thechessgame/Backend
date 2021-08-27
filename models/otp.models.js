import mongoose from "mongoose";
const Schema = mongoose.Schema;

const otpSchema = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const Otp = mongoose.model('otp', otpSchema);