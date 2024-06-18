import MainController from "./controllers/MainController.js";
import util from 'util';


const socketEvents = (io) => {

    io.on('connection', (socket) => {
        console.log('connected', socket.id);

        //監聽加入房間事件
        socket.on('join_room', (data) => {
            console.log(data)

            // 加入房間
            socket.join(data.gameId, MainController.joinRoom(data.gameId, socket.auth));
            socket.emit('room_joined', data.gameId)

            //監聽開始遊戲事件
            socket.on('start_game', (data) => {
                if (socket.adapter.rooms.get(data.gameId).size == 4) {
                    // 遊戲開始 返回莊家
                    io.in(data.gameId).emit('game_started', MainController.startGame(data.gameId))

                    // 發牌
                    socket.on('deal_card', async (data) => {
                        // socket.emit('card_dealed', await MainController.dealPoker(data.game_id))
                        io.in(data.gameId).emit('card_dealed', await MainController.dealPoker(data.game_id))
                    })

                    // 要求結果
                    socket.on('req_result', async (data) => {
                        socket.emit('res_result', await MainController.gameResult(data.game_id));
                    })

                } else {
                    socket.emit('can′t start', "Not enough people")
                };
            });
        });


        
        socket.on('test', async (data) => {
            socket.emit('test', await MainController.gameResult(data.game_id))
        });

        // test
        socket.on('hi', () => {
            console.log('holle');
            // socket.send('holele');
            socket.emit('holle', 'haha');
        });

        socket.on('message', (data) => {
            console.log(data)
            socket.to(data.roomId).emit('message', {
                message: data.message,
                name: socket.id
            })
        })
    });
};

export default socketEvents;