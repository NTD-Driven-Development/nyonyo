import db from "../models/index.js";
const GameStatus = db.gameStatusModels;
import { v4 } from 'uuid';

class ApiGameStartService {
    async gameStart() {
        const game_id = v4();

        //建立遊戲房間
        GameStatus.create({
            game_id: game_id,
        })

        return game_id;
    }
}

export default new ApiGameStartService();