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
        players.forEach((item, index) => {
            if (index === randomIndex) {
                item.role = 'dealer';
                PlayerGame.update({
                    role: item.role,
                },
                    {
                        where: { player_id: item.player_id }
                    }
                )
                console.log(item.player_id, item.player_name)
                return (item.player_id, item.player_name);
            } else {
                item.role = 'player';
                PlayerGame.update({
                    role: item.role,
                },
                    {
                        where: { player_id: item.player_id }
                    }
                )
            }
        });
    }
}

export default new DealerChooseService();