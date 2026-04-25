import { _decorator, Component, sp, Vec2, Node, Vec3, RigidBody2D, IPhysics2DContact, Collider2D, director, Camera, view } from 'cc';
import { AnimationStateMachine } from '../Core/StateMachines/AnimationStateMachine';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {
    @property
    hp: number = 100;

    @property
    speed: number = 5;

    @property(Node)
    positionShoot: Node;

    id: string = '';

    private _animation: AnimationStateMachine;
    private _velocity: Vec2 = new Vec2(0, 0);
    private _direction: number = 1;
    private _limitMove: any;

    private _rigidBody2D: RigidBody2D;

    protected onLoad(): void {
        this._rigidBody2D = this.node.getComponent(RigidBody2D);
        this._limitMove = this._limitPosition();
    }

    protected start(): void {
        this._animation = new AnimationStateMachine(this.node.getComponent(sp.Skeleton));
    }

    protected update(dt: number): void {
        this._updateAnimation();
        this._move(dt);
        this._clampPosition();
    }

    shoot(keyDown: boolean = true) {
        if (keyDown) {
            if (this._animation.isLocked()) {
                return;
            }
            this._velocity.set(0, 0);
            this._animation.shoot();
            emitter.emit(GameEvents.SHOOT, { bulletType: 'BulletFire', direction: this._direction > 0 ? 1 : -1, position: this.positionShoot.worldPosition });
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

    death() {
        this._animation.death();
    }

    private _move(dt: number) {
        this._rigidBody2D.linearVelocity = new Vec2(
            this._velocity.x,
            this._velocity.y
        );
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

    private _setDirection(direction: number) {
        if (direction === 0) {
            return;
        }
        this._direction = this.node.scale.x;
        if (direction * this._direction < 0) {
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

    private _limitPosition() {
        const scene = director.getScene();
        const camera = scene.getComponentInChildren(Camera);
        const visibleSize = view.getVisibleSize();
        const halfWidth = visibleSize.width / 2;
        const halfHeight = visibleSize.height / 2;
        const cameraPosition = camera.node.worldPosition;
        return {
            minX: cameraPosition.x - halfWidth + 50,
            maxX: cameraPosition.x + halfWidth - 50,
            minY: cameraPosition.y - halfHeight,
            maxY: cameraPosition.y + halfHeight - 170
        }
    }

    private _clampPosition() {
        const position = this.node.worldPosition;
        const x = Math.min(this._limitMove.maxX, Math.max(this._limitMove.minX, position.x));
        const y = Math.min(this._limitMove.maxY, Math.max(this._limitMove.minY, position.y));

        if (position.x !== x || position.y !== y) {
            this.node.setWorldPosition(new Vec3(x, y, position.z));
            this._velocity.set(0, 0);
        }
    }
}

