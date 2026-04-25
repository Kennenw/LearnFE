import { _decorator, Collider2D, Component, Contact2DType, RigidBody2D, Vec2, view } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {

    @property
    speed: number = 500;

    @property
    damage: number = 10;

    direction: number;
    private _collider: Collider2D;
    private _rigidBody2D: RigidBody2D;

    protected onLoad(): void {
        this._collider = this.node.getComponent(Collider2D);
        this._rigidBody2D = this.node.getComponent(RigidBody2D);
        this._collider.enabled = false;
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    protected start(): void {
        this.node.setScale(this.node.scale.x * this.direction, this.node.scale.y);
    }

    protected update(dt: number): void {
        this.move();
        this.destruction();
    }

    protected onDestroy(): void {
        this._collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    destruction() {
        const positionWord = this.node.worldPosition;
        const size = view.getVisibleSize();
        if (positionWord.x < 0 || positionWord.x > size.width) {
            this.node.destroy();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        emitter.emit(GameEvents.ENEMY_TAKE_DAMAGE, {
            damage: this.damage,
            target: otherCollider.node
        })
        this.node.destroy();
    }

    move() {
        this._rigidBody2D.linearVelocity = new Vec2(
            this.speed * this.direction,
            0
        );
    }

}

