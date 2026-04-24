import { _decorator, Component, instantiate, Prefab, Node } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { CharacterManager } from './CharacterManager';
import { EnemyManager } from './EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property([Prefab])
    rooms: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _currentRoom: Node;
    private _charactorManager: CharacterManager;
    private _enemyManager: EnemyManager;

    protected onLoad(): void {
        this.rooms.forEach(room => {
            this._prefabs.set(room.name, room);
        })

        this.loadRoom();
    }

    loadRoom(name: string = 'Room') {
        this.play(name);
    }

    onPause() {
        this._charactorManager.pause();
        this._enemyManager.pause();
    }

    onResume() {
        this._charactorManager.resume();
        this._enemyManager.resume();
    }

    play(name: string) {
        const prefab = this._prefabs.get(name);
        this._currentRoom = instantiate(prefab);
        this._currentRoom.parent = this.node;
        this._charactorManager = this._currentRoom.getComponentInChildren(CharacterManager);
        this._enemyManager = this._currentRoom.getComponentInChildren(EnemyManager);
        this._charactorManager.getMainCharacter();
        this._enemyManager.spawn();
    }

    onQuit() {
        this._currentRoom.destroy();
        this._currentRoom = null;
        emitter.emit(GameEvents.LOBBY_START);
    }
}

