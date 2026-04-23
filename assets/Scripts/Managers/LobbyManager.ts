import { _decorator, Component, Sprite } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('LobbyManager')
export class LobbyManager extends Component {
    @property(Sprite)
    sprite: Sprite;

    private _onPlayGame: () => void;
    private _onRoomKey: (data: string[]) => void;
    private _onLobby: () => void;
    private _roomIds: string[] = [];

    protected onLoad(): void {
        this._onRoomKey = this.onRoomKey.bind(this);
        emitter.on(GameEvents.ROOM_ID, this._onRoomKey);

        this._onPlayGame = this.onPlayGame.bind(this);
        emitter.on(GameEvents.BUTTON_PLAY, this._onPlayGame);

        this._onLobby = this.onLobby.bind(this);
        emitter.on(GameEvents.LOBBY_START, this._onLobby);
    }

    onLobby() {
        this.node.active = true;
    }

    onRoomKey(data: string[]) {
        this._roomIds = data;
    }

    onPlayGame() {
        this.node.active = false;
        emitter.emit(GameEvents.SCREEN_ROOM_PLAY, this._roomIds[0]);
    }
}

