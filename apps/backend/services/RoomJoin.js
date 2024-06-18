import db from "../models/index.js";
const PlayerGame = db.playerGameModels;

class RoomJoinService {
    async roomJoin(game_id, auth) {

        return await PlayerGame.create({
            player_id: auth.user.id,
            player_name: auth.user.name,
            game_id: game_id,
        });

    }
}

export default new RoomJoinService();