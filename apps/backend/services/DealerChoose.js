import db from "../models/index.js";
const PlayerGame = db.playerGameModels;

class DealerChooseService {
    async dealerChoose(game_id) {
        const players = await PlayerGame.findAll(
            { raw: true, },
            {
                where: {
                    game_id: game_id
                }
            })

        if (players[0].role != null) { return "game_started" }

        const randomIndex = Math.floor(Math.random() * players.length);
        const dealer = players.map((item, index) => {
            if (index === randomIndex) {
                item.role = 'dealer';
            } else {
                item.role = 'player';
            }
            PlayerGame.update({
                role: item.role,
            },
                {
                    where: { player_id: item.player_id }
                }
            );
            return {
                player_id: item.player_id,
                role: item.role
            }
        });
        return dealer.find((player) => player.role == 'dealer')
    }
}

export default new DealerChooseService();