import { _decorator, Component, instantiate, Prefab, Tween, tween, Vec3 } from 'cc';
import { SymbolController } from './SymbolController';
const { ccclass, property } = _decorator;

@ccclass('ReelController')
export class ReelController extends Component {
    @property(Prefab)
    symbolPrefab: Prefab;

    private _symbolControllers: SymbolController[] = [];
    private readonly SYMBOL_SPACING_Y: number = 125;
    private _isSpinning: boolean = false;
    private _results: number[] = [];

    init() {
        for (let row = 0; row < 5; row++) {
            const symbolNode = instantiate(this.symbolPrefab);
            symbolNode.setPosition(0, 0, 0);
            this.node.addChild(symbolNode);
            this._symbolControllers.push(symbolNode.getComponent(SymbolController));
        }
    }

    startSpin(results: number[]) {
        this._results = results;
        if (this._isSpinning) {
            return;
        }

        this._isSpinning = true;
        Tween.stopAllByTarget(this.node);
        this.spinLoop();
    }

    stopSpin() {
        this._isSpinning = false;
    }

    changeSymbol() {
        const lastSymbol = this._symbolControllers.pop();
        lastSymbol.randomizeSymbol();
        this._symbolControllers.unshift(lastSymbol);
        lastSymbol.node.setPosition(
            0,
            lastSymbol.node.position.y +
            this.SYMBOL_SPACING_Y *
            this._symbolControllers.length,
            0
        )
        lastSymbol.node.setSiblingIndex(0);
        this.node.setPosition(this.node.position.x, 0, 0);
    }

    spinLoop() {
        if (!this._isSpinning) {
            this.showFinalResult();
            return;
        }

        tween(this.node)
            .by(0.05, {
                position: new Vec3(0, -this.SYMBOL_SPACING_Y, 0)
            }, {
                easing: 'quadIn'
            })
            .call(() => {
                this.changeSymbol();
                this.spinLoop();
            })
            .start();
    }

    showFinalResult() {
        for (let i = 0; i < 3; i++) {
            this._symbolControllers[i].setSymbol(
                undefined,
                this._results[i].toString()
            );
        }

        tween(this.node)
            .by(0.3, {
                position: new Vec3(0, -this.SYMBOL_SPACING_Y, 0)
            }, {
                easing: 'quadIn'
            })
            .call(() => {
                this.changeSymbol();
            })
            .start();
    }
}

