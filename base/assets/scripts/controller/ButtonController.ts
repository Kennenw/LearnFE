import { _decorator, Component, Node } from 'cc';
import { GameEventManager } from '../core/GameEventManager';
import { EventConstants } from '../constants/EventConstants';
const { ccclass, property } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {
    eventManager: GameEventManager = null;

    onLoad(): void {
        this.eventManager = this.node.parent.getComponent(GameEventManager);
    }

    onMinusButtonClick(): void {
        this.eventManager.emit(EventConstants.MINUS_BUTTON_CLICK, { value: -1 });
    }

    onPlusButtonClick(): void {
        this.eventManager.emit(EventConstants.PLUS_BUTTON_CLICK, { value: 1 });
    }

    onSpinButtonClick(): void {
        this.eventManager.emit(EventConstants.SPIN_BUTTON_CLICK);
    }
}

