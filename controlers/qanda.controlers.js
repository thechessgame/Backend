import { QandA } from "../models/qanda.models.js";
import { User } from "../models/user.models.js";

import { getPaginatedData } from "../services/pagination.js";

export const allQuestions = async (req, res, next) => {
    const { page, dataPerPage } = req.query;
    try {
        const players = await getPaginatedData(QandA, page, dataPerPage, {}, "subject question createdAt", { path: "creator", select: "imageUrl name" });
        if (!players.data) { return res.error(players.message, null, players.message) }
        const user = await User.findOne({ userName: req.userName });
        players.userId = user._id.toString();
        res.success(`Fetching questions successfull!`, players, `Fetching questions successfull!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const askQuestion = async (req, res, next) => {
    const subject = req.body.subject;
    const question = req.body.question;
    try {
        const user = await User.findOne({ userName: req.userName });
        const creator = user._id.toString();

        const qanda = new QandA({
            subject, question, creator
        })
        await qanda.save();
        res.created(`Question saved successfully!`, null, `Question asked successfully!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const renderEditQuestion = async (req, res, next) => {
    const questionId = req.params.questionId;
    try {
        const qanda = await QandA.findById(questionId);
        if (!qanda) {
            return res.warning(`Invalid Id!`, null, `We are not find any question with this Id!`);
        }
        res.created(`Fetched question successfully!`, {
            subject: qanda.subject,
            question: qanda.question
        }, `Fetched question successfully!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const editQuestion = async (req, res, next) => {
    const subject = req.body.subject;
    const question = req.body.question;
    const questionId = req.body.questionId;

    try {
        const qanda = await QandA.findById(questionId);
        const user = await User.findOne({ userName: req.userName });
        if (qanda.creator.toString() !== user._id.toString()) {
            return res.warning(`Not a Creator!`, null, `Not a Creator!`);
        }
        qanda.subject = subject;
        qanda.question = question;
        await qanda.save();
        return res.success(`Question edited successfully!`, null, `Question edited successfully!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const deleteQuestion = async (req, res, next) => {
    const questionId = req.params.questionId;
    try {
        const qanda = await QandA.findById(questionId);
        if (!qanda) {
            return res.warning(`Invalid Id!`, null, `We are not find any question with this Id!`);
        }
        const user = await User.findOne({ userName: req.userName });
        if (qanda.creator.toString() !== user._id.toString()) {
            return res.warning(`Not a Creator!`, null, `Not a Creator!`);
        }
        await QandA.findByIdAndRemove(questionId);
        return res.success(`Question deleted!`, null, `Question deleted!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const singleQuestion = async (req, res, next) => {
    const questionId = req.params.questionId;
    try {
        const question = await QandA.findById(questionId).populate('replies.creator').populate('creator');
        if (!question) {
            return res.warning(`Invalid Id!`, null, `This reply doesn't exist any more!`);
        }
        const user = await User.findOne({ userName: req.userName });
        res.success(`Fetching question successfull!`, { question, userId: user._id.toString() }, `Fetching questions successfull!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const addReply = async (req, res, next) => {
    const questionId = req.body.questionId;
    const reply = req.body.reply;

    try {
        let question = await QandA.findById(questionId.toString());
        if (!question) {
            return res.warning(`Invalid Id!`, null, `This Question doesn't exist any more!`);
        }
        const user = await User.findOne({ userName: req.userName });
        question.replies.push({
            answer: reply,
            creator: user._id.toString()
        })
        await question.save();
        question = await QandA.findById(questionId.toString()).populate('creator').populate('replies.creator');
        res.created(`Reply saved!`, { userId: user._id.toString(), question }, `Reply accepted!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const renderEditReply = async (req, res, next) => {
    const replyId = req.params.replyId;
    try {
        const question = await QandA.findOne({ 'replies._id': replyId })
        if (!question) {
            return res.warning(`Invalid Id!`, null, `This reply doesn't exist any more!`);
        }
        const data = question.replies.find(reply => reply._id.toString() === replyId.toString());
        res.success(`Data fetched!`, { reply: data.answer }, `Edit reply data fetch!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const editReply = async (req, res, next) => {
    const replyId = req.body.replyId;
    const reply = req.body.reply;

    try {
        let question = await QandA.findOne({ 'replies._id': replyId });
        if (!question) {
            return res.warning(`Invalid Id!`, null, `This reply doesn't exist any more!`);
        }
        const user = await User.findOne({ userName: req.userName });
        const data = question.replies.find(reply => reply._id.toString() === replyId.toString());
        if (data.creator.toString() !== user._id.toString()) {
            return res.warning(`Not a Creator!`, null, `Not a Creator!`);
        }
        const index = question.replies.findIndex(reply => reply._id.toString() === replyId.toString());
        question.replies[index].answer = reply;
        await question.save();
        question = await QandA.findOne({ 'replies._id': replyId }).populate('creator').populate('replies.creator');
        res.success(`Reply edited!`, { question, userId: user._id.toString() }, `Reply edited!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const deleteReply = async (req, res, next) => {
    const replyId = req.params.replyId;

    try {
        let question = await QandA.findOne({ 'replies._id': replyId })
        if (!question) {
            return res.warning(`Invalid Id!`, null, `This reply doesn't exist any more!`);
        }
        const user = await User.findOne({ userName: req.userName });
        const data = question.replies.find(reply => reply._id.toString() === replyId.toString());
        if (data.creator.toString() !== user._id.toString()) {
            return res.warning(`Not a Creator!`, null, `Not a Creator!`);
        }
        question.replies.pull(data._id.toString());
        await question.save();
        question = await QandA.findById(question._id).populate('creator').populate('replies.creator');
        res.success(`Reply deleted!`, { userId: user._id.toString(), question }, `Reply deleted!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const searchQandA = async (req, res, next) => {
    const page = +req.query.page || 1;
    const searchText = req.query.searchText;
    try {
        let questions;
        let totalQuestions;
        if (!searchText) {
            totalQuestions = await QandA.find().countDocuments();
            questions = await QandA
                .find()
                .skip((page - 1) * questionsPerPage)
                .limit(questionsPerPage)
                .populate('creator');
        } else {
            totalQuestions = await QandA.find({ $text: { $search: searchText } }).countDocuments();
            questions = await QandA
                .find({ $text: { $search: searchText } })
                .skip((page - 1) * questionsPerPage)
                .limit(questionsPerPage)
                .populate('creator');
        }

        const user = await User.findOne({ userName: req.userName });
        let previousPage = page - 1;
        let nextPage = page + 1;
        let lastPage = Math.ceil(totalQuestions / questionsPerPage);
        if (!previousPage > 0) { previousPage = 1 }
        if (!nextPage >= lastPage) { nextPage = lastPage }
        res.success(`Searching questions successfull!`, {
            questions,
            userId: user._id.toString(),
            currentPage: page,
            firstPage: 1,
            lastPage,
            previousPage,
            nextPage,
        }, `Searching questions successfull!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

