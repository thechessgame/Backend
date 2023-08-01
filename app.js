import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import playRoutes from "./routes/play.routes.js";
import contactUsRoutes from "./routes/contactus.routes.js";
import QandARoutes from "./routes/qanda.routes.js";

import middlewaresConfig, { responseMiddleware, requestError } from './configs/middlewares.js';

import { constants } from "./configs/constants.js";


import event from "events";
event.EventEmitter.defaultMaxListeners = 50;

const app = express();

middlewaresConfig(app);

app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/play', playRoutes);
app.use('/contactus', contactUsRoutes);
app.use('/qa', QandARoutes);

requestError(app);
responseMiddleware(app);

const server = app.listen(constants.PORT, async () => {
    try {
        await mongoose.connect(constants.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("****Connected to database successfully*****")
    } catch (error) {
        console.log(error)
    }
});