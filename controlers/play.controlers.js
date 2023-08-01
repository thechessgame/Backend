import { User } from "../models/user.models.js";
import { Board } from "../models/play.models.js";

import { getPaginatedData } from "../services/pagination.js";

// import { io } from "../socket.js";

export const getUserName = async (req, res, next) => {
    try {
        res.success('User found', { userName: req.userName })
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const searchPlayers = async (req, res, next) => {
    const { page, searchText, dataPerPage } = req.query;
    try {
        let players;
        if (!searchText) {
            players = await getPaginatedData(User, page, dataPerPage, { userName: { $ne: req.userName } }, "userName name imageUrl rating status")
        } else {
            players = await getPaginatedData(User, page, dataPerPage, { "userName": { $regex: searchText, $ne: req.userName } }, "userName name imageUrl rating status")
        }
        if (!players.data) { return res.error(players.message, null, players.message) }
        res.success('Data fetch success', players, 'Data fetch success')
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const playerMatches = async (req, res, next) => {
    const { page, searchText, dataPerPage } = req.query;
    try {
        let player = await User.find({ userName: req.userName }).select("matches").populate({path: "matches.apponent", select: "name imageUrl rating status"});
        res.success('Data fetch success', { matches: player[0].matches }, 'Data fetch success')
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}


export const sendRequest = async (req, res, next) => {
    const { userName } = req.body;
    try {
        const requester = await User.findOne({ userName: req.userName })
        // io.getIO().emit(userName, { request: true, userName: requester.userName, name: requester.name });
        res.success('Request Send!', null, 'Request Send!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const sendResponse = async (req, res, next) => {
    const { userName, accept, request, drawRequest, pauseRequest } = req.body;
    try {
        const requester = await User.findOne({ userName: req.userName })
        // if (request) { io.getIO().emit(userName, { response: true, accept, userName: requester.userName, name: requester.name }) }
        // if (drawRequest) { io.getIO().emit(userName, { drawresponse: true }) }
        // if (pauseRequest) { io.getIO().emit(userName, { pauseresponse: true }) }
        res.success('Response Send!', { accept }, 'Response Send!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const createBoard = async (req, res, next) => {
    const { player_1, player_2 } = req.body;
    try {
        const user1 = await User.findOne({ userName: player_1 }).select("userName name imageUrl WP rating status matches");
        const user2 = await User.findOne({ userName: player_2 }).select("userName name imageUrl WP rating status matches");
        const board = new Board({
            player1: user1._id.toString(),
            player2: user2._id.toString(),
            result: 'pending',
            pieces: {
                pawn_Ba: { name: 'pawn', unicode: '&#9823', position: 'a1', player: 'b' },
                pawn_Bb: { name: 'pawn', unicode: '&#9823', position: 'b1', player: 'b' },
                pawn_Bc: { name: 'pawn', unicode: '&#9823', position: 'c1', player: 'b' },
                pawn_Bd: { name: 'pawn', unicode: '&#9823', position: 'd1', player: 'b' },
                pawn_Be: { name: 'pawn', unicode: '&#9823', position: 'e1', player: 'b' },
                pawn_Bf: { name: 'pawn', unicode: '&#9823', position: 'f1', player: 'b' },
                pawn_Bg: { name: 'pawn', unicode: '&#9823', position: 'g1', player: 'b' },
                pawn_Bh: { name: 'pawn', unicode: '&#9823', position: 'h1', player: 'b' },
                pawn_Wa: { name: 'pawn', unicode: '&#9817', position: 'a6', player: 'w' },
                pawn_Wb: { name: 'pawn', unicode: '&#9817', position: 'b6', player: 'w' },
                pawn_Wc: { name: 'pawn', unicode: '&#9817', position: 'c6', player: 'w' },
                pawn_Wd: { name: 'pawn', unicode: '&#9817', position: 'd6', player: 'w' },
                pawn_We: { name: 'pawn', unicode: '&#9817', position: 'e6', player: 'w' },
                pawn_Wf: { name: 'pawn', unicode: '&#9817', position: 'f6', player: 'w' },
                pawn_Wg: { name: 'pawn', unicode: '&#9817', position: 'g6', player: 'w' },
                pawn_Wh: { name: 'pawn', unicode: '&#9817', position: 'h6', player: 'w' },
                rook_Ba: { name: 'rook', unicode: '&#9820', position: 'a0', player: 'b' },
                knight_Bb: { name: 'knight', unicode: '&#9822', position: 'b0', player: 'b' },
                bishop_Bc: { name: 'bishop', unicode: '&#9821', position: 'c0', player: 'b' },
                queen_Bd: { name: 'queen', unicode: '&#9819', position: 'd0', player: 'b' },
                king_Be: { name: 'king', unicode: '&#9818', position: 'e0', player: 'b' },
                bishop_Bf: { name: 'bishop', unicode: '&#9821', position: 'f0', player: 'b' },
                knight_Bg: { name: 'knight', unicode: '&#9822', position: 'g0', player: 'b' },
                rook_Bh: { name: 'rook', unicode: '&#9820', position: 'h0', player: 'b' },
                rook_Wa: { name: 'rook', unicode: '&#9814', position: 'a7', player: 'w' },
                knight_Wb: { name: 'knight', unicode: '&#9816', position: 'b7', player: 'w' },
                bishop_Wc: { name: 'bishop', unicode: '&#9815', position: 'c7', player: 'w' },
                queen_Wd: { name: 'queen', unicode: '&#9813', position: 'd7', player: 'w' },
                king_We: { name: 'king', unicode: '&#9812', position: 'e7', player: 'w' },
                bishop_Wf: { name: 'bishop', unicode: '&#9815', position: 'f7', player: 'w' },
                knight_Wg: { name: 'knight', unicode: '&#9816', position: 'g7', player: 'w' },
                rook_Wh: { name: 'rook', unicode: '&#9814', position: 'h7', player: 'w' },
            }
        })
        user1.matches.push({ apponent: user2, match: board, matchStatus: 'ongoing' })
        user2.matches.push({ apponent: user1, match: board, matchStatus: 'ongoing' })
        await board.save();
        await user1.save();
        await user2.save();
        // io.getIO().emit(player_1, { boardCreated: true, player: 'w', apponent: player_2 });
        // io.getIO().emit(player_2, { boardCreated: true, player: 'b', apponent: player_1 });
        // io.getIO().emit(player_1, { renderProfile: true, user: user1, apponent: user2 });
        // io.getIO().emit(player_2, { renderProfile: true, user: user2, apponent: user1 });
        res.created('Board created Successfully!', null, 'Board created Successfully!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const boardData = async (req, res, next) => {
    const { piece, position, apponent } = req.body;
    try {
        console.log(piece, position, apponent);
        // io.getIO().emit(apponent, { changeData: true, piece, position });
        res.success('Data send Successfully!', null, 'Data send Successfully!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const sendExitRequest = async (req, res, next) => {
    const { userName } = req.body;
    try {
        // io.getIO().emit(userName, { exitRequest: true })
        res.success('Request Send!', null, 'Request Send!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const sendDrawRequest = async (req, res, next) => {
    const { userName } = req.body;
    try {
        const user = await User.findOne({ userName: req.userName })
        // io.getIO().emit(userName, { drawRequest: true, user })
        res.success('Request Send!', null, 'Request Send!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const sendPauseRequest = async (req, res, next) => {
    const { userName } = req.body;
    try {
        const user = await User.findOne({ userName: req.userName })
        // io.getIO().emit(userName, { pauseRequest: true, user })
        res.success('Request Send!', null, 'Request Send!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}

export const saveBoardData = async (req, res, next) => {
    const { userName } = req.body;
    try {
        const user = await User.findOne({ userName: req.userName })
        // io.getIO().emit(userName, { pauseRequest: true, user })
        res.success('Request Send!', null, 'Request Send!');
    } catch (err) {
        return res.error(err, null, `Something went wrong!<br>Plz try again later...`)
    }
}