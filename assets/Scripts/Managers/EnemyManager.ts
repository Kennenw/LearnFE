import { _decorator, Component, director, instantiate, Prefab } from 'cc';
import { EnemyController } from '../Controllers/EnemyController';
const { ccclass, property } = _decorator;


@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property([Prefab])
    enemies: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _enemies: Map<string, EnemyController> = new Map();

    protected onLoad(): void {
        this.enemies.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        });
    }

    pause() {
        director.pause();
    }

    resume() {
        director.resume();
    }

    spawn(prefabName: string = 'Enemy01') {
        const prefab = this._prefabs.get(prefabName);
        const node = instantiate(prefab);
        node.parent = this.node;
        this._enemies.set(node.uuid, node.getComponent(EnemyController));
    }
}


