import { _decorator, BlockInputEvents, Component, instantiate, Node, Prefab } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { FreezeNode } from '../Utils/FreezeNode';
const { ccclass, property } = _decorator;

@ccclass('SettingPrefab')
class PopUpPrefab {
    @property
    id: string = '';

    @property(Prefab)
    prefab: Prefab;
}

@ccclass('PopUpManager')
export class PopUpManager extends Component {

    @property([PopUpPrefab])
    popUps: PopUpPrefab[] = [];

    @property(Node)
    backgound: Node;

    private _popUps: Map<string, Prefab> = new Map();
    private _onActive: (id: string) => void;
    private _onInActive: () => void;
    private _currentPopUp: Node;

    protected onLoad(): void {
        this.popUps.forEach((popUp) => {
            this._popUps.set(popUp.id, popUp.prefab);
        });

        this._onActive = this.onActive.bind(this);
        emitter.on(GameEvents.POPUP_SETTING_PLAY, this._onActive);
        emitter.on(GameEvents.POPUP_PAUSE_PLAY, this._onActive);
        this._onInActive = this.onInActive.bind(this);
        emitter.on(GameEvents.POPUP_PAUSE_CLOSE, this._onInActive);
        emitter.on(GameEvents.POPUP_SETTING_CLOSE, this._onInActive);
        emitter.on(GameEvents.ROOM_QUIT, this._onInActive);
    }

    protected onDestroy(): void {
        emitter.off(GameEvents.POPUP_SETTING_PLAY, this._onActive);
        emitter.off(GameEvents.POPUP_PAUSE_PLAY, this._onActive);
        emitter.off(GameEvents.POPUP_PAUSE_CLOSE, this._onInActive);
        emitter.off(GameEvents.POPUP_SETTING_CLOSE, this._onInActive);
        emitter.off(GameEvents.ROOM_QUIT, this._onInActive);
    }

    onActive(id: string) {
        if (this._currentPopUp) {
            this._currentPopUp.destroy();
            this._currentPopUp = null;
        }
        if (!this.node.getComponent(BlockInputEvents)) {
            this.node.addComponent(BlockInputEvents);
        }
        this.backgound.active = true;
        const target = this._popUps.get(id);
        const node = instantiate(target);
        node.parent = this.node;
        node.active = true;
        this._currentPopUp = node;

    }

    onInActive() {
        this.backgound.active = false;
        this._currentPopUp.destroy();
        this._currentPopUp = null;
        const blockInputEvent = this.node.getComponent(BlockInputEvents);
        blockInputEvent.destroy();
        FreezeNode.resumeGame();
    }
}

