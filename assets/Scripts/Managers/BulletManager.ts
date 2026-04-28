import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BulletController } from '../Controllers/BulletController';
import { emitter } from '../Core/Events/Emitter';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
    @property([Prefab])
    bullets: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _bullet: Map<string, BulletController> = new Map();
    private _onSpawn: (bulletType: string, direction: number, position: Vec3) => void;

    protected onLoad(): void {
        this.bullets.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        });
        this._onSpawn = this.onSpwan.bind(this);
        emitter.on(GAME_EVENTS.SHOOT, this._onSpawn);
    }

    protected onDestroy(): void {
        emitter.off(GAME_EVENTS.SHOOT, this._onSpawn);
    }

    onSpwan(data: any) {
        const prefab = this._prefabs.get(data.bulletType);
        const node = instantiate(prefab);
        node.parent = this.node;
        const positionSpwan = this.node.inverseTransformPoint(new Vec3(), data.position);
        node.setPosition(positionSpwan);
        const controller = node.getComponent(BulletController);
        controller.direction = data.direction;
        controller.type = data.bulletType;
        this._bullet.set(node.uuid, controller);
    }
}


