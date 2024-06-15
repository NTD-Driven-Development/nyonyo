import db from "../models/index.js";
const RoomMember = db.roomMembers;

class PokerService {
    // 發牌處理
    async deal(data) {

        const cards = [];
        for (let suit = 1; suit <= 4; suit++) {
            for (let rank = 1; rank <= 13; rank++) {
                const card = { [suit]: rank }
                cards.push(card);
            };
        };
        // cards.sort(() => Math.random() - 0.5);

        const players_res = await RoomMember.findOne({
            // 記得 value 字串要加上引號
            where: {
                room_id: data.roomId
            }
        });

        const players = [];
        players.push(players_res.dataValues.m1);
        players.push(players_res.dataValues.m2);
        players.push(players_res.dataValues.m3);
        players.push(players_res.dataValues.m4);

        const playerHands = deal(players, cards);
        console.log('123456789', playerHands)
        return playerHands;


        // 發牌
        function deal(players, poker) {
            // 隨機洗牌
            poker = shuffle(poker);

            // 創建一個對象來存儲每個玩家的手牌
            const playerHands = {};

            // 初始化每個玩家的手牌
            for (let i = 0; i < players.length; i++) {
                playerHands[players[i]] = [];
            }

            // 每個玩家分發5張牌
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < players.length; j++) {
                    playerHands[players[j]].push(poker.pop());
                }
            }

            return playerHands;
        }

        // 洗牌
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }

    // 結果處理
    gameResult(data) {
        const cardValue = (card) => {
            const value = Object.values(card)[0];
            return value > 10 ? 10 : value;  // 11, 12, 13 轉換為 10
        };

        const cardSuit = (card) => {
            return parseInt(Object.keys(card)[0]);
        };

        const calculateNiu = (hand) => {
            const values = hand.map(cardValue);
            const total = values.reduce((a, b) => a + b, 0);

            for (let i = 0; i < values.length - 2; i++) {
                for (let j = i + 1; j < values.length - 1; j++) {
                    for (let k = j + 1; k < values.length; k++) {
                        if ((values[i] + values[j] + values[k]) % 10 === 0) {
                            const up = hand.filter((_, index) => index !== i && index !== j && index !== k);
                            const down = [hand[i], hand[j], hand[k]];
                            const niu = (total - values[i] - values[j] - values[k]) % 10 || 10;
                            return { up, down, niu };
                        }
                    }
                }
            }
            return { up: hand, down: [], niu: 0 };
        };

        const compareHands = (dealerHand, playerHand) => {
            const dealerResult = calculateNiu(dealerHand);
            const playerResult = calculateNiu(playerHand);

            if (dealerResult.niu > playerResult.niu) return 'dealer';
            if (dealerResult.niu < playerResult.niu) return 'player';

            const dealerMaxCard = Math.max(...dealerHand.map(card => cardValue(card) * 10 + cardSuit(card)));
            const playerMaxCard = Math.max(...playerHand.map(card => cardValue(card) * 10 + cardSuit(card)));

            if (dealerMaxCard > playerMaxCard) return 'dealer';
            if (dealerMaxCard < playerMaxCard) return 'player';

            return 'tie';
        };

        const determineWinner = (gameData) => {
            const dealerId = gameData.dealer;
            const hands = gameData.hands;
            const results = {};

            for (const [player, hand] of Object.entries(hands)) {
                if (player === dealerId) continue;
                const result = compareHands(hands[dealerId], hand);
                results[player] = { result, hand: calculateNiu(hand) };
            }

            return results;
        };

        const result = determineWinner(data);
        return result;
    }


}

export default new PokerService();