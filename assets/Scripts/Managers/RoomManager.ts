import { _decorator, Component, instantiate, Prefab, Node } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('RoomPrefab')
class RoomPrefab {
    @property
    id: string = '';

    @property(Prefab)
    prefab: Prefab;
}

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property([RoomPrefab])
    rooms: RoomPrefab[] = [];

    private _rooms: Map<string, Prefab> = new Map();
    private _currentRoom: Node;
    private _onRoomPlay: (id: string) => void;
    private _onQuit: () => void;

    protected onLoad(): void {
        this.rooms.forEach(room => {
            this._rooms.set(room.id, room.prefab);
        })
        emitter.emit(GameEvents.ROOM_ID, [...this._rooms.keys()]);
        this._onRoomPlay = this.onRoomPlay.bind(this);
        emitter.on(GameEvents.ROOM_PLAY, this._onRoomPlay);
        this._onQuit = this.onQuit.bind(this);
        emitter.on(GameEvents.ROOM_QUIT, this._onQuit);
    }

    onDestroy(): void {
        emitter.off(GameEvents.ROOM_PLAY, this._onRoomPlay);
        emitter.off(GameEvents.ROOM_QUIT, this._onQuit);
    }

    onRoomPlay(id: string) {
        if (this._currentRoom) {
            this._currentRoom.destroy();
            this._currentRoom = null;
        }
        const target = this._rooms.get(id);
        const newNode = instantiate(target);
        newNode.parent = this.node;
        newNode.active = true;
        this._currentRoom = newNode;
    }

    onQuit() {
        this._currentRoom.destroy();
        this._currentRoom = null;
        emitter.emit(GameEvents.LOBBY_START);
    }
}

