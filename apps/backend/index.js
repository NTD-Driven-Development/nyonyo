import http from 'http'
import express from "express";
import path from "path";
import MainRouter from "./routers/Main.js";
import { Server } from "socket.io";
import socketEvents from './socketEvent.js';
import bodyParser from 'body-parser';

import db from "./models/index.js";
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

const app = express();
const PORT = process.env.PORT || 5000
const expressServer = app.listen(PORT, function () {
    console.log("伺服器已上線-> http://localhost:5000");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// const io = new Server(expressServer, {});
const io = new Server(expressServer);
socketEvents(io);

//------------------------------------------------------------------
app.get('/', (req, res) => {
    console.log('welcome ')
    res.json({
        status: 'welcome'
    });
});

app.get('/api/health', (req, res) => {
    console.log('heartbeat ok')
    res.json({
        status: 'ok'
    });
});

app.use(MainRouter);

