import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        subject: {
            type: String,
            required: true
        },

        question: {
            type: String,
            required: true
        },
        replies: [{
            type: new mongoose.Schema({
                answer: {
                    type: String,
                    required: true
                },
                creator: {
                    type: Schema.Types.ObjectId,
                    ref: "user",
                    required: true
                }
            }, { timestamps: true })
        }],
        creator: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    },
    { timestamps: true }
);

// userSchema.index({ subject: 'text', question: 'text', 'replies.answer': 'text' });

userSchema.index({ '$**': 'text' });

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


export const QandA = mongoose.model('QandA', userSchema);