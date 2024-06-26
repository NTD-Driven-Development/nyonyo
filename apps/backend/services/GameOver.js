import axios from 'axios';
import db from "../models/index.js";
const GameStatus = db.gameStatusModels;

class GameOverService {
    async gameOver(game_id) {
        //更新遊戲房間狀態
        const result = await GameStatus.update({
            game_status: 'over',
        },
            {
                where: { game_id: game_id }
            }
        )

        if (result[0] == 0) {
            console.log('status was changed to over')
            return
        }

        const data = {
            gameUrl: `${process.env['FRONT_HOST']}?gameId=${game_id}`
        };

        axios.post(`${process.env['LOBBY_HOST']}/api/rooms/gameEnd`, data)
            .then(response => {
                // console.log(response.data);
            })
            .catch(error => {
                // console.error('Error making POST request:', error);
            });
    }
}

export default new GameOverService();