import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletPrefab')
class BulletPrefab {
    @property
    id: string = '';

    @property(Prefab)
    prefab: Prefab;
}

@ccclass('BulletManager')
export class BulletManager extends Component {
    @property([BulletPrefab])
    bullets: BulletPrefab[] = [];

    private _bullets: Map<string, Prefab> = new Map();
    
    protected onLoad(): void {
        this.bullets.forEach(bullet => {
            this._bullets.set(bullet.id, bullet.prefab);
        })
    }

}


