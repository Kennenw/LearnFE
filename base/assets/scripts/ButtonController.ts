import { _decorator, Component, Node } from 'cc';
import { GameEventManager } from './core/GameEventManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {
    eventManager: GameEventManager = null;

    onLoad(): void {
        this.eventManager = this.node.parent.getComponent(GameEventManager);
    }

    onMinusButtonClick(): void {
        this.eventManager.emit("MINUS_BUTTON_CLICK", { value: -1 });
    }

    onPlusButtonClick(): void {
        this.eventManager.emit("PLUS_BUTTON_CLICK", { value: 1 });
    }

}

