import db from "../models/index.js";
const GameStatus = db.gameStatusModels;

class GameStartService {
    async gameStart(game_id) {
        //更新遊戲房間狀態
        GameStatus.update({
            game_status: 'in-progress',
        },
            {
                where: { game_id: game_id }
            }
        )
    }
}

export default new GameStartService();