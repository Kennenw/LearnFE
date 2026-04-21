const mEmitter = require('../mEmitter');
const charactorManager = require('./charactorManager');
const { Event } = require('./constant');

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        id: 0,
        bulletManager: cc.Node,
        shotPosition: cc.Node,
        shootCooldown: 0.1
    },

    onLoad() {
        this.shootTimer = 0;
        this.isShooting = false;
        this.state = 'idle';
        this.bulletType = 0;
        this.direction = cc.v2(0, 0);
        const skeleton = this.node.getComponent(sp.Skeleton);
        charactorManager.instance.register(this.id, skeleton);
        this.changeState(this.state);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    changeBullet() {
        this.bulletType += 1;
        if (this.bulletType > 4) {
            this.bulletType = 0;
        } else if (this.bulletType < 0) {
            this.bulletType = 4
        }
    },

    update(dt) {
        if (this.isShooting) {
            this.shootTimer -= dt;
            if (this.shootTimer <= 0) {
                this.shoot();
                this.shootTimer = this.shootCooldown;
            }
            return;
        }

        this.node.setPosition(
            this.node.x + dt * this.speed * this.direction.x,
            this.node.y + dt * this.speed * this.direction.y
        );
    },

    shoot() {
        const positionFire = this.bulletManager.convertToNodeSpaceAR(this.shotPosition.convertToWorldSpaceAR(cc.v2(0, 0)));
        mEmitter.instance.emit(Event.SHOOT, {
            type: this.bulletType,
            position: positionFire
        })
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left: {
                this.direction.x = -1;
                break;
            }
            case cc.macro.KEY.right: {
                this.direction.x = 1;
                break;
            }
            case cc.macro.KEY.up: {
                this.direction.y = 1;
                break;
            }
            case cc.macro.KEY.down: {
                this.direction.y = -1;
                break;
            }
            case cc.macro.KEY.space: {
                this.isShooting = true;
                if (this.shootTimer <= 0) {
                    this.shootTimer = 0;
                }
                break;
            }
            case cc.macro.KEY.d: {
                console.log(this.bulletType);
                this.changeBullet();
                break;
            }
            default:
                break;
        }
        this.updateAnimationState();
    },

    updateAnimationState() {
        if (this.isShooting) {
            this.changeState('shoot');
            return;
        }
        const isMoving = this.direction.x !== 0 || this.direction.y !== 0;
        const state = isMoving ? 'walk' : 'idle';
        this.changeState(state);
    },

    changeState(newState) {
        if (newState !== this.state) {
            this.state = newState;
            charactorManager.instance.play(this.id, this.state);
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right: {
                this.direction.x = 0;
                break;
            }
            case cc.macro.KEY.up:
            case cc.macro.KEY.down: {
                this.direction.y = 0;
                break;
            }
            case cc.macro.KEY.space: {
                this.isShooting = false;
                this.shootTimer = 0;
                break;
            }
            default:
                break;
        }
        this.updateAnimationState();
    },
});
