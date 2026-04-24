import { _decorator, Component, ICollisionEvent, sp } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {

    @property
    speed: number = 500;

    @property
    lifeTime: number = 5;

    @property
    damage: number = 10;

    direction: number;

    protected update(dt: number): void {
        this.move(dt);
        this.destruction(dt);
    }

    destruction(dt) {
        this.direction -= dt;
        if (this.direction <= 0) {
            this.node.destroy();
        }
    }

    onCollisionEnter(event: ICollisionEvent) {
        emitter.emit(GameEvents.BULLET_HIT, {
            damage: this.damage,
            target: event.otherCollider
        })
        this.node.destroy();
    }

    move(dt) {
        this.node.setPosition(
            this.node.position.x + dt * this.speed * this.direction,
            this.node.position.y
        )
    }

}

