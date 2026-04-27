import { _decorator, Collider2D, Component, instantiate, Label, Node, Prefab, ProgressBar, Sprite, tween, v3, Vec3 } from 'cc';
import { GameEvents } from '../Core/Constants/GameEvents';
import { emitter } from '../Core/Events/Emitter';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar

    @property(Prefab)
    damageText: Prefab

    @property
    damageAttack: number = 20;

    @property
    speed: number = 100;

    @property
    hp: number = 100;

    @property
    attackRange: number = 50;

    @property
    attackCooldown: number = 1;

    @property
    score: number = 10;

    private _direction: Vec3 = new Vec3();
    private _attackCooldown: number = this.attackCooldown;
    private _isDeath: boolean = false;
    private _maxHp: number = this.hp;

    calculateDamage(damge: number) {
        this._updateProgressBar(damge);
        this._showDamage(damge);
    }

    move(dt: number, target: Node) {
        if (!this.node) {
            return;
        }
        const playerPosition = target.worldPosition.clone();
        const enemyPosition = this.node.worldPosition.clone();

        this._attackCooldown -= dt;

        this._direction = playerPosition.subtract(enemyPosition);
        const distanceY = Math.abs(this._direction.y);
        const distanceX = Math.abs(this._direction.x);

        if (Math.abs(this._direction.x) > 0.01) {
            const currentDirection = Math.abs(this.node.scale.x);
            this.node.setScale(
                this._direction.x > 0 ? -currentDirection : currentDirection,
                this.node.scale.y
            );
        }

        if (distanceY > 1) {
            const directionY = Math.sign(this._direction.y);
            this.node.setWorldPosition(
                enemyPosition.x,
                enemyPosition.y + directionY * this.speed * dt,
                enemyPosition.z
            );
            return;
        }

        if (distanceX > this.attackRange) {
            const directionX = Math.sign(this._direction.x);
            this.node.setWorldPosition(
                enemyPosition.x + directionX * this.speed * dt,
                enemyPosition.y,
                enemyPosition.z
            );
            return;
        }

        if (this._attackCooldown <= 0) {
            this._attack(target.worldPosition);
            this._attackCooldown = this.attackCooldown;
        }
    }

    private _attack(targetWorldPos: Vec3) {
        if (this._isDeath) {
            return;
        }
        const startLocalPos = this.node.position.clone();
        const selfWorldPos = this.node.worldPosition.clone();

        const distanceToTarget = targetWorldPos.clone().subtract(selfWorldPos).length();

        const lungeDirection = this.node.scale.x >= 0 ? 1 : -1;

        let lungeDistance = Math.min(this.attackRange, distanceToTarget - this.attackRange * 0.2);

        tween(this.node)
            .sequence(
                tween(this.node).to(0.18, { position: startLocalPos.clone().add(v3(lungeDistance * lungeDirection, 0, 0)) }, { easing: 'quadOut' }),
                tween(this.node).call(() => {
                    emitter.emit(GameEvents.PLAYER_TAKE_DAMAGE, {
                        damage: this.damageAttack
                    });
                }),
                tween(this.node).to(0.22, { position: startLocalPos }, { easing: 'quadIn' })
            )
            .start();


    }

    private _updateProgressBar(damage: number) {
        this.hp -= damage;
        this.hp = Math.max(this.hp, 0);
        if (this.hp === 0) {
            this._death();
        }
        this.progressBar.progress = this.hp / this._maxHp;
    }

    private _death() {
        if (this._isDeath) {
            return;
        }
        if (!this.node || !this.node.isValid) {
            return;
        }
        emitter.emit(GameEvents.CALCULATE_SCORE, { score: this.score })
        this._isDeath = true;
        const colliders = this.node.getComponents(Collider2D);
        colliders.forEach(collider => {
            collider.destroy();
        });
        this.speed = 0;
        const sprite = this.node.getComponent(Sprite);
        tween(sprite.color)
            .by(1, { a: 0 })
            .call(() => {
                if (this.node && this.node.isValid) {
                    this.node.destroy();
                }
            })
            .start();
    }

    private _showDamage(damage: number) {
        const node = instantiate(this.damageText);
        node.parent = this.node;
        node.position.add(v3(0, 70, 0));
        const label = node.getComponent(Label);
        if (Math.abs(this._direction.x) > 0.01) {
            const currentDirection = Math.abs(node.scale.x);
            node.setScale(
                this._direction.x > 0 ? -currentDirection : currentDirection,
                node.scale.y
            );
        }
        label.string = `-${damage}`;
        tween(node)
            .by(1, { position: v3(0, 50, 0) })
            .call(() => {
                if (node && node.isValid) {
                    node.destroy();
                }
            })
            .start();
    }
}

