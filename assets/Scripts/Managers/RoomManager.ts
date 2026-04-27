import { _decorator, Component, instantiate, Prefab, Node, BlockInputEvents, Button } from 'cc';
import { RoomController } from '../Controllers/RoomController';
import { PopUpManager } from './PopUpManager';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { SceneManager } from './SceneManager';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property([Prefab])
    rooms: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _currentRoom: Node;
    private _currentNameRoom: string;
    private _popUp: PopUpManager;
    private _scene: SceneManager;
    private _onPlayPause: () => void;
    private _onClosePause: () => void;
    private _onPlaySetting: () => void;
    private _onCloseSetting: () => void;
    private _onQuitRoom: () => void;
    private _onResetRoom: () => void;

    protected onLoad(): void {
        this._popUp = PopUpManager.instance;
        this._scene = SceneManager.instance;
        this.rooms.forEach(room => {
            this._prefabs.set(room.name, room);
        })
        this._onPlayPause = this.onPlayPause.bind(this);
        emitter.on(GameEvents.PAUSE_PLAY, this._onPlayPause);
        this._onClosePause = this.onClosePause.bind(this);
        emitter.on(GameEvents.PAUSE_CLOSE, this._onClosePause);
        this._onPlaySetting = this.onPlaySetting.bind(this);
        emitter.on(GameEvents.SETTING_PLAY, this._onPlaySetting);
        this._onCloseSetting = this.onCloseSetting.bind(this);
        emitter.on(GameEvents.SETTING_CLOSE, this._onCloseSetting);
        this._onQuitRoom = this.onQuit.bind(this);
        emitter.on(GameEvents.ROOM_QUIT, this._onQuitRoom);
        this._onResetRoom = this.onReset.bind(this);
        emitter.on(GameEvents.ROOM_RESET, this._onResetRoom);
    }

    protected onDestroy(): void {
        emitter.off(GameEvents.PAUSE_PLAY, this._onPlayPause);
        emitter.off(GameEvents.PAUSE_CLOSE, this._onClosePause);
        emitter.off(GameEvents.SETTING_PLAY, this._onPlaySetting);
        emitter.off(GameEvents.SETTING_CLOSE, this._onCloseSetting);
        emitter.off(GameEvents.ROOM_QUIT, this._onQuitRoom);
        emitter.off(GameEvents.ROOM_RESET, this._onResetRoom);
    }

    protected start(): void {
        this.loadRoom('Room-01');
    }

    onPlayPause() {
        const wave = this._currentRoom.getComponent(RoomController).currentWave;
        this._popUp.showPause(wave);
        if (!this.node.getComponent(BlockInputEvents)) {
            this.node.addComponent(BlockInputEvents);
        }
        this._enableButton(false);
    }

    onClosePause() {
        this._popUp.hidePause();
        this._enableButton();
    }

    onPlaySetting() {
        this.onClosePause();
        this._popUp.showSetting();
        this._enableButton(false);
    }

    onCloseSetting() {
        this._popUp.hideSetting();
        this.onPlayPause();
        this._enableButton();
    }

    loadRoom(name: string = 'Room-01') {
        this._currentNameRoom = name;
        const prefab = this._prefabs.get(name);
        this._currentRoom = instantiate(prefab);
        this._currentRoom.parent = this.node;
        this._currentRoom.getComponent(RoomController).init();
    }

    onQuit() {
        this.onClosePause();
        this._popUp.hideAll();
        this._currentRoom.destroy();
        this._scene.loadScene();
    }

    onReset() {
        this._currentRoom.destroy();
        this.loadRoom(this._currentNameRoom);
        this.onClosePause();
    }

    private _enableButton(isEnable: boolean = true) {
        this.node.parent.getComponentsInChildren(Button).forEach((button => {
            if (isEnable) {
                button.onEnable();
            } else {
                button.onDisable();
            }
        }))
    }
}

