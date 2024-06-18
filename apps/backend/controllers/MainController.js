import ApiGameStartService from '../services/ApiGameStart.js';
import PokerService from '../services/Poker.js';
import RoomJoinService from '../services/RoomJoin.js';
import GameStartService from '../services/GameStart.js';
import DealerChooseService from '../services/DealerChoose.js';
import GameOverService from '../services/GameOver.js';

export class MainController {
    //api
    api_startGame = async (req, res) => {
        const game_id = await ApiGameStartService.gameStart();

        res.json({
            status: 'room_created',
            gameUrl: `${process.env['FRONT_HOST']}?gameId=${game_id}`
        });
    }

    test = async (req, res) => {
        res.json({
            status: req.data
        });
        await GameStartService.gameStart(game_id);
        const dealer = await DealerChooseService.dealerChoose(game_id);
    }


    //socket
    joinRoom = async (game_id, auth) => {//加入房間  !!!!!!!!!!!!!
        console.log(game_id, auth)
        await RoomJoinService.roomJoin(game_id, auth);
    }

    startGame = async (game_id) => {//開始遊戲並選擇莊家 
        await GameStartService.gameStart(game_id);
        const dealer = await DealerChooseService.dealerChoose(game_id);
        return dealer;
    }

    dealPoker = async (game_id) => {// 發牌
        const p_cards = await PokerService.deal(game_id);
        // console.log('controller', p_cards);
        return p_cards;
    }

    gameResult = async (game_id) => {
        const result = await PokerService.gameResult(game_id);
        return result;
    }

    overGame = async (game_id) => {//開始遊戲並選擇莊家 
        await GameOverService.gameOver(game_id);
    }

}

export default new MainController();