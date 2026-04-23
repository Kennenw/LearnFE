import { _decorator, Component, Node } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { PopUp } from '../Core/Constants/PopUp';
import { FreezeNode } from '../Utils/FreezeNode';
const { ccclass, property } = _decorator;

@ccclass('RoomNode')
class RoomNode {
    @property
    id: string = '';

    @property(Node)
    node: Node
}

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property([RoomNode])
    rooms: RoomNode[] = [];

    private _rooms: Map<string, Node> = new Map();
    private _currentRoom: string = '';
    private _onRoomPlay: (id: string) => void;
    private _onQuit: () => void;

    protected onLoad(): void {
        this.rooms.forEach(room => {
            this._rooms.set(room.id, room.node);
        })

        emitter.emit(GameEvents.ROOM_ID, [...this._rooms.keys()]);
        this._onRoomPlay = this.onRoomPlay.bind(this);
        emitter.on(GameEvents.SCREEN_ROOM_PLAY, this._onRoomPlay);
        this._onQuit = this.onQuit.bind(this);
        emitter.on(GameEvents.ROOM_QUIT, this._onQuit);
    }

    onRoomPlay(id: string) {
        const target = this._rooms.get(id);
        target.active = true;
        this._currentRoom = id;
    }

    onQuit() {
        const target = this._rooms.get(this._currentRoom);
        target.destroy();
        emitter.emit(GameEvents.LOBBY_START);
    }
}

