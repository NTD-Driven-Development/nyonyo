import { DB, USER, PASSWORD, HOST, PORT, dialect as _dialect, pool as _pool } from "../config/db.config.js";
import RoomMemberModel from "./RoomMember.model.js";

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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.roomMembers = RoomMemberModel(sequelize, Sequelize);

export default db;