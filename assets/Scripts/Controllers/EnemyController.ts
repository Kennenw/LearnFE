import { _decorator, Component, Prefab, ProgressBar, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar

    @property(Prefab)
    damage: Prefab

    @property
    speed: number = 100;

    @property
    hp: number = 100;

    private _velocity: Vec2 = new Vec2(1, 0);

    protected update(dt: number): void {
        this.move(dt);
        this._updateProgressBar();
    }

    move(dt: number) {
        this.node.setPosition(
            this.node.position.x + dt * this.speed * this._velocity.x,
            this.node.position.y + dt * this.speed * this._velocity.y
        )
    }

    private _updateProgressBar() {
        if (this.hp <= 0) {
            this.speed = 0;
        }
        this.progressBar.progress = this.hp / 100;
    }

    showDamage(damage: number) {

    }
}

