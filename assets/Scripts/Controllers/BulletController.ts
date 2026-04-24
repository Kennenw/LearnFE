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
        console.log('firs2t', this.node.position.x)
        console.log('firs2t', this.direction)
        console.log('first', this.node.position.x + dt * this.speed * this.direction)
        this.move(dt);
        this.destruction(dt);
    }

    destruction(dt) {
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
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

