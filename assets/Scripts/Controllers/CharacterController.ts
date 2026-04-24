import { _decorator, Component, sp, Vec2, Node, Vec3 } from 'cc';
import { AnimationStateMachine } from '../Core/StateMachines/AnimationStateMachine';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property
    speed: number = 5;

    @property(Node)
    positionShoot: Node;

    id: string = '';

    private _animation: AnimationStateMachine;
    private _velocity: Vec2 = new Vec2(0, 0);
    private _previousDirection: number = 1;

    protected start(): void {
        this._animation = new AnimationStateMachine(this.node.getComponent(sp.Skeleton));
    }

    protected update(dt: number): void {
        this._updateAnimation();
        this._move(dt);
    }

    private _move(dt: number) {
        this.node.setPosition(
            this.node.position.x + this._velocity.x * dt,
            this.node.position.y + this._velocity.y * dt
        )
    }

    private _isIdle(): boolean {
        return this._velocity.x === 0 && this._velocity.y === 0;
    }

    private _updateAnimation() {
        if (this._animation.isLocked()) {
            return;
        }
        if (this._isIdle()) {
            this._animation.idle();
        } else {
            this._animation.run();
        }
    }

    shoot(keyDown: boolean = true) {
        if (keyDown) {
            if (this._animation.isLocked()) {
                return;
            }
            this._velocity.set(0, 0);
            this._animation.shoot();
            const positionShoot = this.positionShoot.inverseTransformPoint(new Vec3(), this.node.worldPosition);
            console.log('local:', this.positionShoot.position);
            console.log('world:', this.positionShoot.worldPosition);
            emitter.emit(GameEvents.SHOOT, { bulletType: 'BulletFire', direction: this._previousDirection, position: this.positionShoot.worldPosition });
        }
    }

    moveLeft(keyDown: boolean = true) {
        this._setVelocityX(keyDown, -1);
    }

    moveRight(keyDown: boolean = true) {
        this._setVelocityX(keyDown, 1);
    }

    moveUp(keyDown: boolean = true) {
        this._setVelocityY(keyDown, 1);
    }

    moveDown(keyDown: boolean = true) {
        this._setVelocityY(keyDown, -1);
    }

    private _setDirection(direction: number) {
        if (direction === 0) {
            return;
        }
        this._previousDirection = this.node.scale.x;
        const currentScaleX = this.node.scale.x;
        if (direction * currentScaleX < 0) {
            this.node.setScale(this.node.scale.y * direction, this.node.scale.y);
        }
    }

    private _setVelocityX(keyDown: boolean, direction: number) {
        if (keyDown) {
            if (this._animation.isLocked()) {
                return;
            }

            this._velocity.x = this.speed * direction;
            this._setDirection(direction);
        } else {
            this._velocity.x = 0;
        }
    }

    private _setVelocityY(keyDown: boolean, direction: number) {
        if (keyDown) {
            if (this._animation.isLocked()) {
                return;
            }

            this._velocity.y = this.speed * direction;
        } else {
            this._velocity.y = 0;
        }
    }

}

