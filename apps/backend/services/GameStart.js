import db from "../models/index.js";
const RoomMember = db.roomMembers;
import { v4 } from 'uuid';

class RoomCreatService {
    async gameStart() {
        const game_id = v4();
        return game_id;
    }
}

export default new RoomCreatService();