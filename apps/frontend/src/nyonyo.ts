import { Project } from 'paper/dist/paper-core';
import { Socket, io } from 'socket.io-client';
import { type ToastCloseHandle } from '~/src/notificator';
import { Deck } from '~/src/deck';
import { Hand } from '~/src/hand';
import Queue from 'queue';
import _ from 'lodash';

export class NyoNyo extends Project {
    gameId: string;
    playerId: string;
    playerName: string;
    socket: Socket;
    isDealing: boolean = false;
    hands: Map<string, Hand>;
    deck?: Deck;
    messageQueue: Queue = new Queue({ results: [] });
    waitPlayerJoinToastCloseHandle?: ToastCloseHandle;
    isYourTurnToastCloseHandle?: ToastCloseHandle;
    handCompletedToastCloseHandle?: ToastCloseHandle;
    endedToastCloseHandle?: ToastCloseHandle;

    constructor(canvas: HTMLCanvasElement, gameId: string, playerId: string, playerName: string = `player ${playerId}`) {
        super(canvas);

        if (canvas.clientWidth >= 700) {
            this.view.scale(1);
        }
        else {
            this.view.scale(0.5);
        }

        this.gameId = gameId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.hands = new Map();

        const config = useRuntimeConfig();

        const socket: Socket = io(config.public.BACKEND_URL, {
			reconnectionDelayMax: 0,
			reconnectionDelay: 0,
			forceNew: true,
			transports: ['websocket'],
            query: {
                playerId: playerId,
                playerName: playerName,
            },
		});
        
        this.socket = socket;

        this.startListen();
    }

    startListen = () => {
        this.socket.on('game_started', async () => {
            this.socket.emit('deal_card', {
                data: {},
            });
        });

        this.socket.on('room_joined', () => {
            this.socket.emit('start_game', {
                type: 'start_game',
                data: {},
            });
        });

        this.socket.on('card_dealed', async (evnet) => {
            this.messageQueue.push(async (cb) => {
                console.log(evnet);
                
                this.socket.emit('req_result', {
                    data: {},
                });

                cb?.(undefined, undefined);
            });
        });

        this.socket.on('res_result', (event) => {
            // this.messageQueue.push(async (cb) => {
            //     const txt = _.reduce(event.data.ranking, (txt, v) => {
            //         return txt += `第${v.rank}名：${v.name}${v.rank != 4 ? '\n' : ''}`
            //     }, '');
                
            //     this.handCompletedToastCloseHandle?.();
            //     this.endedToastCloseHandle = toast(`遊戲結束。\n排名：\n${txt}`, this.view.center);

            //     const loserHand = this.hands.get(_.find(event.data.ranking, (v) => v.rank == 4)?.playerId!)!;
            //     loserHand.cards[0].faceDown = false;
            //     loserHand.cards[0].cardType = 5;
            //     loserHand.cards[0].cardNo = 1;

            //     cb?.(undefined, undefined);
            // });
        });

        this.socket.emit('join_room', {
            data: {},
        });

        this.messageQueue.concurrency = 1;
        this.messageQueue.autostart = true;
    }
}