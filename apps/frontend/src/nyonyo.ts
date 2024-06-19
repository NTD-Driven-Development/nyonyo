import { Project } from 'paper/dist/paper-core';
import { Socket, io } from 'socket.io-client';
import { toast, type ToastCloseHandle } from '~/src/notificator';
import { Deck } from '~/src/deck';
import { Hand } from '~/src/hand';
import Queue from 'queue';
import _ from 'lodash';

export class NyoNyo extends Project {
    gameId: string;
    playerId: string;
    playerName: string;
    bankerPlayerId?: string;
    socket: Socket;
    isDealing: boolean = false;
    hands: Map<string, Hand>;
    deck?: Deck;
    messageQueue: Queue = new Queue({ results: [] });
    waitPlayerJoinToastCloseHandle?: ToastCloseHandle;
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
        this.socket.on('game_started', async (event) => {
            this.messageQueue.push(async (cb) => {
                this.bankerPlayerId = event.player_id;

                this.socket.emit('deal_card', {
                    gameId: this.gameId,
                });

                cb?.(undefined, undefined);
            });
        });

        this.socket.on('room_joined', () => {
            this.messageQueue.push(async (cb) => {
                this.socket.emit('start_game', {
                    gameId: this.gameId,
                });

                cb?.(undefined, undefined);
            });
        });

        this.socket.on('card_dealed', async (event: any) => {
            this.messageQueue.push(async (cb) => {
                this.waitPlayerJoinToastCloseHandle?.();

                const players = [];

                for (const key in event) {
                    players.push({
                        key: key,
                        values: event[key]
                    });
                }

                const index = players.findIndex((v) => v.key == this.playerId);

                if (index > -1) {
                    const subPlayers = players.splice(index, players.length - index);
                    players.unshift(...subPlayers);
                }

                const hand1 = new Hand();
                hand1.position = this.view.bounds.bottomCenter.add([0, -hand1.bounds.height / 2]);
                toast(`${players[0].key} (${players[0].key == this.bankerPlayerId ? '莊家' : '閒家'})`, this.view.bounds.bottomCenter.add([0, -hand1.bounds.height -15]), { rotate: 0 });

                const hand2 = new Hand();
                hand2.position = this.view.bounds.leftCenter.add([hand1.bounds.height / 2, 0]);
                hand2.rotate(90);
                toast(`${players[1].key} (${players[1].key == this.bankerPlayerId ? '莊家' : '閒家'})`, this.view.bounds.leftCenter.add([hand1.bounds.height + 15, 0]), { rotate: 90 });

                const hand3 = new Hand();
                hand3.position = this.view.bounds.topCenter.add([0, hand1.bounds.height / 2]);
                hand3.rotate(180);
                toast(`${players[2].key} (${players[2].key == this.bankerPlayerId ? '莊家' : '閒家'})`, this.view.bounds.topCenter.add([0, hand1.bounds.height + 15]), { rotate: 180 });

                const hand4 = new Hand();
                hand4.position = this.view.bounds.rightCenter.add([-hand1.bounds.height / 2, 0]);
                hand4.rotate(270);
                toast(`${players[3].key} (${players[3].key == this.bankerPlayerId ? '莊家' : '閒家'})`, this.view.bounds.rightCenter.add([-hand1.bounds.height - 15, 0]), { rotate: 270 });

                this.hands.set(players[0].key, hand1);
                this.hands.set(players[1].key, hand2);
                this.hands.set(players[2].key, hand3);
                this.hands.set(players[3].key, hand4);

                this.deck = await Deck.make(this.view.bounds.center, players.length * 5);
                await this.deck.shuffle(10, { time: 0.2 });

                for (const i of _.range(0, players.length * 5)) {
                    const player = players[i % 4];
                    const hand = this.hands.get(player.key)!;

                    const card = await this.deck?.deal(hand)!;

                    if (player.key == this.playerId || true) {
                        for (const cardKey in player.values?.[hand.cards.length - 1]!) {
                            const suit = cardKey;
                            const rank = player.values?.[hand.cards.length - 1][cardKey];

                            suit == '1' && (card.cardType = 1);
                            suit == '2' && (card.cardType = 2);
                            suit == '3' && (card.cardType = 3);
                            suit == '4' && (card.cardType = 4);
                            rank == '1' && (card.cardNo = 1);
                            rank == '2' && (card.cardNo = 2);
                            rank == '3' && (card.cardNo = 3);
                            rank == '4' && (card.cardNo = 4);
                            rank == '5' && (card.cardNo = 5);
                            rank == '6' && (card.cardNo = 6);
                            rank == '7' && (card.cardNo = 7);
                            rank == '8' && (card.cardNo = 8);
                            rank == '9' && (card.cardNo = 9);
                            rank == '10' && (card.cardNo = 10);
                            rank == '11' && (card.cardNo = 11);
                            rank == '12' && (card.cardNo = 12);
                            rank == '13' && (card.cardNo = 13);
                            
                            card.faceDown = false;
                        }
                    }
                }
                
                this.socket.emit('req_result', {
                    gameId: this.gameId,
                });

                cb?.(undefined, undefined);
            });
        });

        this.socket.on('res_result', (event) => {
            this.messageQueue.push(async (cb) => {
                const players = [];

                for (const key in event) {
                    players.push({
                        key: key,
                        values: event[key]
                    });
                }

                const txt = _.reduce(players, (txt, v, i) => {
                    if (v.values['result']) {
                        const hands = [...v.values['hand']['down'], ...v.values['hand']['up']]
                        .map((obj) => {
                            const map = {
                                '1': 'A',
                                '11': 'J',
                                '12': 'Q',
                                '13': 'K',
                            }
                            if (_.has(map, Object.values(obj)[0] as string)) {
                                return _.get(map, Object.values(obj)[0] as string);
                            }
                            else {
                                return Object.values(obj)[0];
                            }
                        });
                        return txt += `${v.key}：${v.values['result']}( ${hands.join(' ')} )${i != 3 ? '\n' : ''}`
                    }
                    else {
                        return txt += '';
                    }
                }, '');
                
                this.endedToastCloseHandle = toast(`遊戲結束。\n${this.bankerPlayerId == this.playerId ? '你是莊家' : '你是閒家' }\n結果：\n${txt}`, this.view.center);

                const loserHand = this.hands.get(_.find(event.data.ranking, (v) => v.rank == 4)?.playerId!)!;
                loserHand.cards[0].faceDown = false;
                loserHand.cards[0].cardType = 5;
                loserHand.cards[0].cardNo = 1;

                cb?.(undefined, undefined);
            });
        });

        this.socket.emit('join_room', {
            gameId: this.gameId,
        });

        this.waitPlayerJoinToastCloseHandle = toast('等待其他玩家加入中', this.view.center);

        this.messageQueue.concurrency = 1;
        this.messageQueue.autostart = true;
    }
}