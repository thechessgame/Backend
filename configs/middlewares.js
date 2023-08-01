import bodyParser from "body-parser";
import cors from 'cors';
import path from "path";
import fs from "fs";
import express from "express";
import chalk from 'chalk';

import { Response } from "../models/response.model.js";
import admin from 'firebase-admin'
import { firebaseServiceAccountConstants, firebaseConstants } from "./constants.js";

admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccountConstants),
    databaseURL: firebaseConstants.FIREBASE_RT_DATABASE_URL,
    storageBucket: firebaseConstants.FIREBASE_BUCKET_NAME,
});

export default app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(fs.realpathSync('.'), 'images')));
    app.use(cors());
}

export const requestError = app => {
    app.use((req, res, next) => {
        res.status(404).send({ code: 404, message: "Request not found" });
    });
}

export const responseMiddleware = app => {
    app.response.success = function (message, data, displayMessage) {
        console.log(chalk.greenBright(message));
        this.status(200).send(
            Response('success', message, data, displayMessage, 200),
        );
    };

    app.response.created = function (message, data, displayMessage) {
        console.log(chalk.greenBright(message));
        this.status(201).send(
            Response('created', message, data, displayMessage, 201),
        );
    };

    app.response.warning = function (message, data, displayMessage) {
        console.log(chalk.yellow(message));
        this.status(422).send(
            Response('warning', message, data, displayMessage, 422),
        );
    };

    app.response.error = function (message, data, displayMessage) {
        console.log(chalk.red(message));
        if (data) {
            console.log(chalk.red(data));
        }
        message = typeof message != 'string' ? 'Something went wrong' : message;
        this.status(400).send(Response('error', message, data, displayMessage, 400));
    };

    app.response.unauthorizedUser = function (message) {
        console.log(chalk.blueBright('Unauthorized User'));
        this.status(401).send(
            Response('authorization', 'Unauthorized User', null, message || 'Unauthorized User', 401),
        );
    };
}