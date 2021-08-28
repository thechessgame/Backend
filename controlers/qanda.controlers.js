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
    const { subject, question } = req.body;
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
    const { questionId } = req.params;
    try {
        const qanda = await QandA.findById(questionId).select("subject question");
        if (!qanda) {
            return res.warning(`Invalid Id!`, null, `We are not find any question with this Id!`);
        }
        res.created(`Fetched question successfully!`, qanda, `Fetched question successfully!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const editQuestion = async (req, res, next) => {
    const { subject, question, questionId } = req.body;

    try {
        const user = await User.findOne({ userName: req.userName });
        const qanda = await QandA.findOneAndUpdate({ _id: questionId, creator: user._id.toString() }, { subject, question });
        if (!qanda) {
            return res.warning(`Not a Creator!`, null, `Not a Creator!`);
        }
        return res.success(`Question edited successfully!`, null, `Question edited successfully!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const deleteQuestion = async (req, res, next) => {
    const { questionId } = req.params;
    try {
        const user = await User.findOne({ userName: req.userName });
        const qanda = await QandA.findOneAndRemove({ _id: questionId, creator: user._id.toString() });
        if (!qanda) {
            return res.warning(`Not a Creator!`, null, `Not a Creator!`);
        }
        return res.success(`Question deleted!`, null, `Question deleted!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const singleQuestion = async (req, res, next) => {
    const { questionId } = req.params;
    try {
        const question = await QandA.findById(questionId)
            .populate([{ path: "replies.creator", select: "imageUrl name" }, { path: "creator", select: "imageUrl name" }])
            .select("subject question createdAt replies.createdAt replies._id replies.answer");
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
    const { questionId, reply } = req.body;
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
        question = await QandA.findById(questionId)
            .populate([{ path: "replies.creator", select: "imageUrl name" }, { path: "creator", select: "imageUrl name" }])
            .select("subject question createdAt replies.createdAt replies._id replies.answer");
        res.created(`Reply saved!`, { userId: user._id.toString(), question }, `Reply accepted!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const renderEditReply = async (req, res, next) => {
    const { replyId } = req.params;
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
    const { replyId, reply } = req.body;
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
        question = await QandA.findOne({ 'replies._id': replyId })
            .populate([{ path: "replies.creator", select: "imageUrl name" }, { path: "creator", select: "imageUrl name" }])
            .select("subject question createdAt replies.createdAt replies._id replies.answer");
        res.success(`Reply edited!`, { question, userId: user._id.toString() }, `Reply edited!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const deleteReply = async (req, res, next) => {
    const { replyId } = req.params;

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
        question = await QandA.findOne({ 'replies._id': replyId })
            .populate([{ path: "replies.creator", select: "imageUrl name" }, { path: "creator", select: "imageUrl name" }])
            .select("subject question createdAt replies.createdAt replies._id replies.answer");
        res.success(`Reply deleted!`, { userId: user._id.toString(), question }, `Reply deleted!`);
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

export const searchQandA = async (req, res, next) => {
    const { page, searchText, dataPerPage } = req.query;
    try {
        let players;
        if (!searchText) {
            players = await getPaginatedData(QandA, page, dataPerPage, {}, "subject question createdAt", { path: "creator", select: "imageUrl name" })
        } else {
            players = await getPaginatedData(QandA, page, dataPerPage, { "$text": { $search: searchText } }, "subject question createdAt", { path: "creator", select: "imageUrl name" })
        }
        if (!players.data) { return res.error(players.message, null, players.message) }
        const user = await User.findOne({ userName: req.userName });
        players.userId = user._id.toString();
        res.success('Data fetch success', players, 'Data search successfull');
    } catch (err) {
        return res.error(err, null, `Something went wrong, Plese try again later!`);
    }
}

