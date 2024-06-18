import { DB, USER, PASSWORD, HOST, PORT, dialect as _dialect, pool as _pool } from "../config/db.config.js";
import PlayerGameModel from "./PlayerGame.model.js";
import GameStatusModel from "./GameStatus.model.js"

import Sequelize from "sequelize";

const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: _dialect,
    operatorsAliases: false,
    port: PORT,

    pool: {
        max: _pool.max,
        min: _pool.min,
        acquire: _pool.acquire,
        idle: _pool.idle
    }
});
sequelize.sync({ force: false });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.playerGameModels = PlayerGameModel(sequelize, Sequelize);
db.gameStatusModels = GameStatusModel(sequelize, Sequelize);

export default db;