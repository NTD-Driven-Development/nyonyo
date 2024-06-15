import MainController from "./controllers/MainController.js";
import util from 'util';


const socketEvents = (io) => {

    io.on('connection', (socket) => {
        console.log('connected', socket.id);

        //加入後動作
        socket.on('join_room', (data) => {
            console.log(data)
            socket.join(data.roomId);
            socket.emit('room_joined', data.roomId)

            socket.on('start_game', () => {
                console.log('asd', socket.adapter.rooms.get(data.roomId).size);
                if (socket.adapter.rooms.get(data.roomId).size == 4) {
                    io.in(data.roomId).emit('game_started')

                    socket.on('deal_card', async (data) => {
                        socket.emit('card_dealed', await MainController.dealPoker(data))
                    })

                    
                } else {
                    socket.emit('can′t start')
                };
            });
        });


        ////////////////////////
        socket.on('req_result', (data) => {
            socket.emit('res_result', MainController.gameResult(data));
            // socket.emit('res_result', gameData);
        })
        /////////////////////////
        socket.on('close', () => {
            console.log('disconnected');
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