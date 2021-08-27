import jwt from "jsonwebtoken";

import { io } from "../socket.js";
import { User } from "../models/user.models.js";

import { constants } from "../configs/constants.js"

export const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.unauthorizedUser('Your authorization failed!<br>You have to need to login again!')
    }
    try {
        const token = authHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, constants.JWT_SECRET);
        if (!decodedToken) {
            return res.unauthorizedUser('Your authorization failed!<br>You have to need to login again!')
        }
        req.userName = decodedToken.userName;
        await io.getIO().on('connection', socket => {
            User.findOne({ userName: decodedToken.userName })
                .then(user => {
                    user.status = 'on';
                    return user.save();
                })
                .catch(err => {
                    console.log(err);
                })
        }) 
        await io.getIO().on('disconnect', () => {
            User.findOne({ userName: decodedToken.userName })
                .then(user => {
                    user.status = new Date();
                    return user.save()
                })
                .catch(err => {
                    console.log(err);
                })
        })
        next();
    } catch (err) {
        return res.unauthorizedUser('Your authorization failed!<br>You have to need to login again!')
    }
}