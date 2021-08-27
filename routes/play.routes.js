import express from "express";

const router = express.Router();

import * as playControler from "../controlers/play.controlers.js";

import { isAuth } from "../middleware/is-auth.js";

import { validationMiddleware } from "../middleware/validation.js";
import { schemas } from "../services/validation.js";


router.get('/getusername', isAuth, playControler.getUserName);

router.get('/playersearch', isAuth, playControler.searchPlayers);

router.get('/playermatchessearch', isAuth, playControler.playerMatches);

router.post('/sendrequest',
    isAuth,
    validationMiddleware(schemas.blogSendRequestToPlay),
    playControler.sendRequest);

router.post('/sendresponse',
    isAuth,
    validationMiddleware(schemas.blogSendResponse),
    playControler.sendResponse);

router.post('/createBoard',
    isAuth,
    validationMiddleware(schemas.blogCreatedBoard),
    playControler.createBoard);


router.patch('/boardData',
    isAuth,
    validationMiddleware(schemas.blogBoardData),
    playControler.boardData);


router.post('/sendExitRequest',
    isAuth,
    validationMiddleware(schemas.blogUserName),
    playControler.sendExitRequest)

router.post('/sendDrawRequest',
    isAuth,
    validationMiddleware(schemas.blogUserName),
    playControler.sendDrawRequest)

router.post('/sendPauseRequest',
    isAuth,
    validationMiddleware(schemas.blogUserName),
    playControler.sendPauseRequest)

export default router;