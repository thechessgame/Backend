import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        name: {
            type: String,
            def: 'Unknown'
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            default: 'images/blank-profile.png'
        },
        contactNumber: {
            type: String,
            default: 'Not Given🙁'
        },
        WP: {
            type: String,
            default: '0/0'
        },
        rating: {
            type: String,
            default: '1'
        },
        status: {
            type: String,
            default: new Date()
        },
        matches: [{
            apponent: {
                type: Schema.Types.ObjectId,
                ref: "user",
                required: true
            },
            match: {
                type: Schema.Types.ObjectId,
                ref: "Board",
                required: true
            },
            matchStatus: String
        }]
    },
    { timestamps: true }
);

// userSchema.index({ userName: 'text', name: 'text' });
// mongoose.set('useCreateIndex', true);


export const User = mongoose.model('user', userSchema);