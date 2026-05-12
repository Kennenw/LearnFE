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
    private _reelControllers: ReelController[] = [];
    private _onSpinRequest: (data: any) => void;
    private _onStopSpin: () => void;
    private _currentWinAmount: number = 0;

    onLoad(): void {
        this.eventManager = this.node.parent.getComponent(GameEventManager);
        this._onSpinRequest = this.onSpinRequest.bind(this);
        this._onStopSpin = this.onStopSpin.bind(this);
    }

    onEnable(): void {
        this.eventManager.on(EventConstants.SPIN_REQUEST, this._onSpinRequest);
        this.eventManager.on(EventConstants.SPIN_STOP_BUTTON_CLICK, this._onStopSpin);
    }

    start() {
        this.initReels();
    }

    onStopSpin() {
        let totalDelay: number = 0;
        for (let i = 0; i < this._reelControllers.length; i++) {
            totalDelay += i * 0.15;
            this.scheduleOnce(() => {
                this._reelControllers[i].stopSpin();
            }, i * 0.15);
        }

        this.scheduleOnce(() => {
            this.eventManager.emit(
                EventConstants.RESULT_SPIN,
                this._currentWinAmount
            );
        }, totalDelay);
    }

    initReels() {
        this.container.destroyAllChildren();
        this._reelControllers = [];
        for (let column = 0; column < 5; column++) {
            const symbolNode = instantiate(this.reelPrefab);
            this.container.addChild(symbolNode);
            const controller = symbolNode.getComponent(ReelController);
            this._reelControllers.push(controller);
            controller.init();
        }
    }

    private onSpinRequest(data: any) {
        this._currentWinAmount = data.winAmount;
        for (let i = 0; i < this._reelControllers.length; i++) {
            this.actionReels(i, this.resultReel(i, data.matrix));
        }
    }

    private resultReel(reelIndex: number, result: number[]): number[] {
        return result.slice(reelIndex * 3, reelIndex * 3 + 3);
    }

    private actionReels(reelIndex: number, result: number[]) {
        const controller = this._reelControllers[reelIndex];
        controller.startSpin(result);
    }

    onDestroy(): void {
        this.eventManager.off(EventConstants.SPIN_REQUEST, this._onSpinRequest);
        this.eventManager.off(EventConstants.SPIN_STOP_BUTTON_CLICK, this._onStopSpin);
    }
}

