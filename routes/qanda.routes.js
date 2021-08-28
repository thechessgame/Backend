import express from "express";

const router = express.Router();

import * as QandAControler from "../controlers/qanda.controlers.js";

import { isAuth } from "../middleware/is-auth.js";

import { validationMiddleware } from "../middleware/validation.js";
import { schemas } from "../services/validation.js";


router.get('/questions', isAuth, QandAControler.allQuestions);

router.get('/question/:questionId', isAuth, validationMiddleware(schemas.blogQuestionId, "params"), QandAControler.singleQuestion);

router.get('/editQuestion/:questionId', isAuth, validationMiddleware(schemas.blogQuestionId, "params"), QandAControler.renderEditQuestion);

router.get('/editReply/:replyId', isAuth, validationMiddleware(schemas.blogReplyId, "params"), QandAControler.renderEditReply);

router.patch('/reply',
    isAuth,
    validationMiddleware(schemas.blogquestionreply),
    QandAControler.addReply);

router.patch('/editReply',
    isAuth,
    validationMiddleware(schemas.blogeditreply),
    QandAControler.editReply);

router.post('/ask',
    isAuth,
    validationMiddleware(schemas.blogaskquestion),
    QandAControler.askQuestion);

router.put('/editquestion',
    isAuth,
    validationMiddleware(schemas.blogeditquestion),
    QandAControler.editQuestion);


router.delete('/deleteQuestion/:questionId', isAuth, validationMiddleware(schemas.blogQuestionId, "params"), QandAControler.deleteQuestion);

router.delete('/deleteReply/:replyId', isAuth, validationMiddleware(schemas.blogReplyId, "params"), QandAControler.deleteReply);

router.get('/search', isAuth, QandAControler.searchQandA);

export default router;