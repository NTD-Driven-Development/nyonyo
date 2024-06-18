import { config } from 'dotenv';
config();
import http from 'http'
import express from "express";
import path from "path";
import MainRouter from "./routers/Main.js";
import { Server } from "socket.io";
import socketEvents from './socketEvent.js';
import bodyParser from 'body-parser';


import db from "./models/index.js";
db.sequelize.sync({ force: false })
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

const io = new Server(expressServer);

io.use((socket, next) => {
    const { playerId, playerName } = socket.handshake.query
    const { id, name } = socket.handshake.auth
    const player = {
        id: playerId ?? id,
        name: playerName ?? name,
    }

    if (typeof player.id !== 'string' || typeof player.name !== 'string') {
        return next(
            new Error(
                'No Authorization handshake information found, query{"playerId": "[id]", "playerName": "[name]" } }); https://socket.io/docs/v3/middlewares/#sending-credentials ',
            ),
        )
    }
    socket.auth = { user: player }
    // console.log(socket.auth)
    return next()
});
socketEvents(io);


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

