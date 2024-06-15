import GameStartService from '../services/GameStart.js';
import PokerService from '../services/Poker.js';

export class MainController {

    startGame = async (req, res) => {
        console.log(req.body);
        const result = await GameStartService.gameStart(req.body);

        if (result.dataValues) {
            res.json({
                status: 'ok',
                host: ''
            });
        } else {
            res.json({
                status: 'filed',
            });
        }
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