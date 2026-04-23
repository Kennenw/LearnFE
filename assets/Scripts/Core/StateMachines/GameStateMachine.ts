import StateMachine from 'javascript-state-machine';
import { GAME_SCREEN_STATE } from '../Constants/GameState';
import { emitter } from '../Events/Emitter';

type ScreenPayload = {
    roomId?: string,
    popupId?: string
}

export class GameStateMachine {
    private _state: StateMachine;
    private _payload: ScreenPayload = {};
    constructor() {
        this._state = new StateMachine({
            init: GAME_SCREEN_STATE.LOBBY,

            transations: [
                { name: 'lobby', from: GAME_SCREEN_STATE.POPUP, to: GAME_SCREEN_STATE.LOBBY },
                { name: 'room', from: [GAME_SCREEN_STATE.LOBBY, GAME_SCREEN_STATE.POPUP], to: GAME_SCREEN_STATE.ROOM },
                { name: 'popup', from: '*', to: GAME_SCREEN_STATE.POPUP }
            ],

            methods: {
                onEnterState: (lifecycle: any) => {
                    emitter.emit();
                }
            }
        })
    }

    toRoom(id: string) {
        this._payload = { roomId: id };
        this._state.room();
    }

    toPopup(id: string) {
        this._payload = { popupId: id };
        this._state.popup();
    }

    toLobby() {
        this._state.lobby();
    }
}

