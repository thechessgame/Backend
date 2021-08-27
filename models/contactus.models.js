import mongoose from "mongoose";
const Schema = mongoose.Schema;

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true
        },
        comment: {
            type: String,
            require: true
        }
    }
);

export const ContactUs = mongoose.model('contactus', contactSchema);