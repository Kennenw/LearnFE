import { _decorator, Component, sp, Vec2 } from 'cc';
import { CharacterManager } from '../Managers/CharacterManager';
import { AnimationStateMachine } from '../Core/StateMachines/AnimationStateMachine';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property
    speed: number = 5;

    @property(sp.Skeleton)
    spine!: sp.Skeleton;

    @property
    id: string = '1';

    private _animation: AnimationStateMachine;
    private _velocity: Vec2 = new Vec2(0, 0);
    private _lockMovement: boolean = false;

    protected start(): void {
        CharacterManager.instance.register(this.id, this);
        this._animation = new AnimationStateMachine(this.spine);
        this._animation.onShootComplete = () => {
            this._lockMovement = false;
        };
    }

    protected update(dt: number): void {
        this._updateAnimation();
        if (!this._animation.isShooting()) {
            this._lockMovement = false;
        }
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
            this._lockMovement = true;
            this._velocity.set(0, 0);
            this._animation.shoot();
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

        const currentScaleX = this.node.scale.x;
        if (direction * currentScaleX < 0) {
            this.node.setScale(this.node.scale.y * direction, this.node.scale.y);
        }
    }

    private _setVelocityX(keyDown: boolean, direction: number) {
        if (this._lockMovement) {
            this._velocity.x = 0;
            return;
        }
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
        if (this._lockMovement) {
            this._velocity.y = 0;
            return;
        }
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

