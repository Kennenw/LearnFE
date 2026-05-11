import { _decorator, Component, Graphics, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReelController')
export class ReelController extends Component {
    @property([Prefab])
    symbolPrefabs: Prefab[] = [];

    private _reelMatrix: number[] = [];

    onLoad() {
        this.init();
    }

    init() {
        for (let i = 0; i < 3; i++) {
            const symbolIndex = Math.floor(Math.random() * this.symbolPrefabs.length);
            const symbolPrefab = this.symbolPrefabs[symbolIndex];
            const symbolNode = instantiate(symbolPrefab);
            symbolNode.setPosition(0, 0, 0);
            this.node.addChild(symbolNode);
            this._reelMatrix.push(symbolIndex);
        }
    }

    getSymbol(matrix: number[]): void {
        matrix.push(this._reelMatrix[1]);
    }

}

