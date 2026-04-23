import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyPrefab')
class EnemyPrefab {
    @property
    id: string = '';

    @property(Prefab)
    prefab: Prefab;
}

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    @property([EnemyPrefab])
    enemys: EnemyPrefab[] = [];

    private _enemys: Map<string, Prefab> = new Map();
    
    protected onLoad(): void {
        this.enemys.forEach(enemy => {
            this._enemys.set(enemy.id, enemy.prefab);
        })
    }
}


