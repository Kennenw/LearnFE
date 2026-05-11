import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ReelController } from './ReelController';
import { GameEventManager } from '../core/GameEventManager';
import { EventConstants } from '../constants/EventConstants';
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {
    @property(Prefab)
    reelPrefab: Prefab;

    @property(Node)
    container: Node;

    eventManager: GameEventManager = null;
    private _paylines: string[][] = [];
    private _onSpinRequest: (data: any) => void;

    onLoad(): void {
        this.eventManager = this.node.parent.getComponent(GameEventManager);
        this._onSpinRequest = this.onSpinRequest.bind(this);
    }

    onEnable(): void {
        this.eventManager.on(EventConstants.SPIN_REQUEST, this._onSpinRequest);
    }

    start() {
        this.initReels();
    }

    initReels() {
        this.container.destroyAllChildren();
        this._paylines = [];
        for (let column = 0; column < 5; column++) {
            const symbolNode = instantiate(this.reelPrefab);
            this.container.addChild(symbolNode);
            const controller = symbolNode.getComponent(ReelController)
            controller.init();
            this._paylines.push(controller.getSymbol());
        }
    }

    private onSpinRequest(data: any) {
        this.initReels();
        console.log('first', data);
        console.log('second', this._paylines);
    }

    private checkPaylines() {
        this.eventManager.emit(EventConstants.CALCULATE_WALLET);
    }

    onDestroy(): void {
        this.eventManager.off(EventConstants.SPIN_REQUEST, this._onSpinRequest);
    }
}

