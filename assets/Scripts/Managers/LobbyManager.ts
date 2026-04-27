import { _decorator, Button, Component, Sprite } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { SceneManager } from './SceneManager';
import { PopUpManager } from './PopUpManager';

const { ccclass, property } = _decorator;

@ccclass('LobbyManager')
export class LobbyManager extends Component {
    @property(Sprite)
    sprite: Sprite;

    private _onPlayGame: () => void;
    private _onPlaySetting: () => void;
    private _onCloseSetting: () => void;
    private _popUp: PopUpManager;
    private _scene: SceneManager;

    protected onLoad(): void {
        this._scene = SceneManager.instance;
        this._popUp = PopUpManager.instance;
        this._onPlayGame = this.onPlayGame.bind(this);
        emitter.on(GameEvents.BUTTON_PLAY, this._onPlayGame);
        this._onPlaySetting = this.onPlaySetting.bind(this);
        emitter.on(GameEvents.SETTING_PLAY, this._onPlaySetting);
        this._onCloseSetting = this.onCloseSetting.bind(this);
        emitter.on(GameEvents.SETTING_CLOSE, this._onCloseSetting);
    }

    protected onDestroy(): void {
        emitter.off(GameEvents.BUTTON_PLAY, this._onPlayGame);
        emitter.off(GameEvents.SETTING_PLAY, this._onPlaySetting);
        emitter.off(GameEvents.SETTING_CLOSE, this._onCloseSetting);
    }

    onLobby() {
        this.node.active = true;
    }

    onPlayGame() {
        this._scene.loadScene('Room');
    }

    onPlaySetting() {
        this._popUp.showSetting();
        this._enableButton(false);
    }

    onCloseSetting() {
        this._popUp.hideSetting();
        this._enableButton();
    }

    private _enableButton(isEnable: boolean = true) {
        this.node.getComponentsInChildren(Button).forEach((button => {
            if (isEnable) {
                button.onEnable();
            } else {
                button.onDisable();
            }
        }))
    }
}

