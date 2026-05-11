import { _decorator, Component, Graphics, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReelController')
export class ReelController extends Component {
    @property([Prefab])
    symbolPrefabs: Prefab[] = [];

    private _symbols: string[] = [];

    init() {
        for (let row = 0; row < 5; row++) {
            const symbolIndex = Math.floor(Math.random() * this.symbolPrefabs.length);
            const symbolPrefab = this.symbolPrefabs[symbolIndex];
            const symbolNode = instantiate(symbolPrefab);
            symbolNode.setPosition(0, 0, 0);
            this.node.addChild(symbolNode);
            this._symbols.push(symbolNode.name);
        }
    }

    getSymbol(): string[] {
        return [
            this._symbols[1],
            this._symbols[2],
            this._symbols[3]
        ];
    }

}

