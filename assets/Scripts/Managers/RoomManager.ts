import { _decorator, Component, instantiate, Prefab, Node, v3, ProgressBar } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { RoomController } from '../Controllers/RoomController';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property([Prefab])
    rooms: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _currentRoom: Node;

    protected onLoad(): void {
        this.rooms.forEach(room => {
            this._prefabs.set(room.name, room);
        })

        this.loadRoom();
    }

    loadRoom(name: string = 'Room') {
        const prefab = this._prefabs.get(name);
        this._currentRoom = instantiate(prefab);
        this._currentRoom.parent = this.node;
        this._currentRoom.getComponent(RoomController).init();
    }

    onQuit() {
        this._currentRoom.destroy();
        this._currentRoom = null;
        emitter.emit(GameEvents.LOBBY_START);
    }
}

