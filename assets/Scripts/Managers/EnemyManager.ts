import { _decorator, Component, director, instantiate, Prefab, Node, Vec3, Camera, view, math } from 'cc';
import { EnemyController } from '../Controllers/EnemyController';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;


@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property([Prefab])
    enemies: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _enemies: Map<string, EnemyController> = new Map();
    private _onHit: (damage: number, target: Node) => void;
    _target: Node = null;


    protected onLoad(): void {
        this.enemies.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        });
        this._onHit = this.onHit.bind(this);
        emitter.on(GameEvents.ENEMY_TAKE_DAMAGE, this._onHit);
    }

    protected onDestroy(): void {
        emitter.off(GameEvents.ENEMY_TAKE_DAMAGE, this._onHit);
    }

    protected update(dt: number): void {

        if (!this._target) {
            return;
        }
        this.move(dt, this._target);
    }

    onHit(data: any) {
        const target = this._enemies.get(data.target.uuid);
        target.calculateDamage(data.damage);
    }

    move(dt: number, target: Node) {
        this._enemies.forEach(enemy => {
            enemy.move(dt, target);
        });
    }

    spawn(playerWorldPosition: Vec3, prefabName: string = 'Enemy01'): Node {
        const spawnPosition = this._randomPosition(playerWorldPosition);
        if (!spawnPosition) {
            return;
        }
        const prefab = this._prefabs.get(prefabName);
        const node = instantiate(prefab);
        node.parent = this.node;
        node.setWorldPosition(spawnPosition);
        this._enemies.set(node.uuid, node.getComponent(EnemyController));
        return node;
    }

    private _randomPosition(playerWorldPosition: Vec3): Vec3 {
        const limit = this._limitPosition();
        const safeDistance = 100;
        let positionSpawn: Vec3 = new Vec3();
        for (let index = 0; index < 20; index++) {
            positionSpawn.x = math.randomRange(limit.minX, limit.maxX);
            positionSpawn.y = math.randomRange(limit.minX, limit.maxY);
            positionSpawn.z = 0;
            if (Vec3.distance(positionSpawn, playerWorldPosition) > safeDistance) {
                return positionSpawn;
            }
        }
        return null;
    }

    private _limitPosition() {
        const scene = director.getScene();
        const camera = scene.getComponentInChildren(Camera);
        const visibleSize = view.getVisibleSize();
        const halfWidth = visibleSize.width / 2;
        const halfHeight = visibleSize.height / 2;
        const cameraPosition = camera.node.worldPosition;
        return {
            minX: cameraPosition.x - halfWidth + 100,
            maxX: cameraPosition.x + halfWidth - 100,
            minY: cameraPosition.y - halfHeight,
            maxY: cameraPosition.y + halfHeight - 500
        }
    }
}


