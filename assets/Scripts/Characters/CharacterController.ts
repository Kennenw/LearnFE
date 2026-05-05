import { _decorator, Component, sp, Vec2, Node, Vec3, RigidBody2D, director, Camera, view, Collider2D, Contact2DType, Prefab, instantiate, v3, Label, tween } from 'cc';
import { AnimationStateMachine } from '../Core/StateMachines/AnimationStateMachine';
import { emitter } from '../Core/Events/Emitter';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
import { AudioManager } from '../Managers/AudioManager';
import { BULLET_TYPE } from '../Core/Constants/Bullet';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {
    @property
    hp: number = 100;

    @property
    speed: number = 5;

    @property(Node)
    positionShoot: Node;

    @property(Prefab)
    healText: Prefab;

    id: string = '';

    private _animation: AnimationStateMachine;
    private _velocity: Vec2 = new Vec2(0, 0);
    private _direction: number = 1;
    private _limitMove: any;
    private _rigidBody2D: RigidBody2D;
    private _collider: Collider2D;
    _currentHp: number;

    bulletType: string = BULLET_TYPE.BULLET_NORMAL;

    protected onLoad(): void {
        this._rigidBody2D = this.node.getComponent(RigidBody2D);
        this._collider = this.node.getComponent(Collider2D);
        this._limitMove = this._limitPosition();
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this._currentHp = this.hp;
    }

    protected start(): void {
        this._animation = new AnimationStateMachine(this.node.getComponent(sp.Skeleton));
    }

    protected update(dt: number): void {
        this._updateAnimation();
        this._move(dt);
        this._clampPosition();
    }

    setBulletType(type: string) {
        this.bulletType = type;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.group === 16) {
            emitter.emit(GAME_EVENTS.PICK_ITEM, {
                id: otherCollider.node.uuid,
                item: otherCollider.node
            });
        }
    }

    healHP(amount: number) {
        this._currentHp = Math.min(this._currentHp + amount, this.hp);
        this._showTextHeal(amount);
    }

    caculateDamage(damage: number) {
        this._currentHp = Math.max(this._currentHp - damage, 0);
        return {
            maxHP: this.hp,
            currentHP: this._currentHp
        };
    }

    private _showTextHeal(amount: number) {
        const node = instantiate(this.healText);
        node.parent = this.node;
        node.position.add(v3(0, 70, 0));
        const label = node.getComponent(Label);
        label.string = `+${amount}`;
        tween(node)
            .by(1, { position: v3(0, 50, 0) })
            .call(() => {
                if (node && node.isValid) {
                    node.destroy();
                }
            })
            .start();
    }

    shoot(keyDown: boolean = true) {
        if (keyDown) {
            if (this._animation.isLocked()) {
                return;
            }
            this._velocity.set(0, 0);
            AudioManager.instance.playSfx();
            this._animation.shoot();
            emitter.emit(GAME_EVENTS.SHOOT, {
                bulletType: this.bulletType,
                direction: this._direction > 0 ? 1 : -1,
                position: this.positionShoot.worldPosition
            });
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

    protected onDestroy(): void {
        this._collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
}