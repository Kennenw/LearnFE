import { _decorator, Camera, Collider2D, Component, IPhysics2DContact, RigidBody2D, v2, Vec2, view } from 'cc';
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
    }

    protected update(dt: number): void {
        this._collider.on('begin-contact', this.onBeginContact, this);
        this.move();
        this.destruction();
    }

    destruction() {
        const positionWord = this.node.worldPosition;
        const size = view.getVisibleSize();
        if (positionWord.x < 0 || positionWord.x > size.width) {
            this.node.destroy();
        }
    }

    onBeginContact(contact: IPhysics2DContact, selfCollider, otherCollider) {
        emitter.emit(GameEvents.BULLET_HIT, {
            damage: this.damage,
            target: otherCollider
        })
        console.log('first')
        this.node.destroy();
    }

    move() {
        this._rigidBody2D.linearVelocity = new Vec2(
            this.speed * this.direction,
            0
        );
    }

}

