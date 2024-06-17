import GameStartService from '../services/GameStart.js';
import PokerService from '../services/Poker.js';
import RoomCreatService from '../services/RoomCreat.js';

export class MainController {
    //api
    startGame = async (req, res) => {
        const game_id = await GameStartService.gameStart();

        res.json({
            status: 'room_created',
            gameUrl: `${process.env['FRONT_HOST']}?gameId=${game_id}`
        });
    }


    //socket
    creatRoom = async (data) => {
        const game_id = await RoomCreatService.roomCreat(data);

        res.json({
            status: 'room_created',
            gameUrl: `${process.env['FRONT_HOST']}?gameId=${game_id}`
        });
    }
    dealPoker = async (data) => {
        const p_cards = await PokerService.deal(data);
        console.log(p_cards);
        return p_cards;
    }

    gameResult = (data) => {
        const result = PokerService.gameResult(data);
        return result;
    }

}

export default new MainController();