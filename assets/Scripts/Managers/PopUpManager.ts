import { _decorator, BlockInputEvents, BlockInputEventsComponent, Component, Node, game, director } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { PopUp } from '../Core/Constants/PopUp';
const { ccclass, property } = _decorator;

@ccclass('SettingNode')
class PopUpNode {
    @property
    id: string = '';

    @property(Node)
    node: Node;
}

@ccclass('PopUpManager')
export class PopUpManager extends Component {

    @property([PopUpNode])
    popUps: PopUpNode[] = [];

    @property(Node)
    backgound: Node;

    private _popUps: Map<string, Node> = new Map();
    private _onActive: (id: string) => void;
    private _onInActive: (id: string) => void;

    protected onLoad(): void {
        this.popUps.forEach((popUp) => {
            this._popUps.set(popUp.id, popUp.node);
        });

        this._onActive = this.onActive.bind(this);
        emitter.on(GameEvents.POPUP_SETTING_PLAY, this._onActive);
        emitter.on(GameEvents.POPUP_PAUSE_PLAY, this._onActive);
        this._onInActive = this.onInActive.bind(this);
        emitter.on(GameEvents.POPUP_CLOSE, this._onInActive);
    }

    onActive(id: string) {
        if (id === PopUp.SETTING) {
            const pause = this._popUps.get(PopUp.PAUSE);
            pause.active = false;
        }
        this.node.addComponent(BlockInputEvents);
        this.backgound.active = true;
        const target = this._popUps.get(id);
        target.active = true;
    }

    onInActive(id: string) {
        console.log('id', id);
        const target = this._popUps.get(id);
        target.active = false;
    }
}

