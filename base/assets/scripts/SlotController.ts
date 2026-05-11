import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ReelController } from './ReelController';
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {
    @property(Prefab)
    reelPrefab: Prefab;

    @property(Node)
    container: Node;

    private _paylines: number[];

    onLoad() {
        this.init();
    }

    init() {
        for (let i = 0; i < 5; i++) {
            const symbolNode = instantiate(this.reelPrefab);
            symbolNode.setPosition(0, 0, 0);
            console.log(symbolNode);
            this.container.addChild(symbolNode);
            symbolNode.getComponent(ReelController).getSymbol(this._paylines);
        }
    }

}

