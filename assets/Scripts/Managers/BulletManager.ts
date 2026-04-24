import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BulletController } from '../Controllers/BulletController';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
    @property([Prefab])
    bullets: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _bullet: BulletController;

    protected onLoad(): void {
        this.bullets.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        })
    }

    spwan(prefabName: string, direction: number, position: Vec3) {
        const prefab = this._prefabs.get(prefabName);
        const node = instantiate(prefab);
        node.setPosition(position);
        this._bullet = this.node.getComponent(BulletController);
        this._bullet.direction = direction;
        node.parent = this.node;
    }

    pause() {
        director.pause();
    }

    resume() {
        director.resume();
    }


}


