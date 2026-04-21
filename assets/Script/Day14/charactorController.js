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
        shootCooldown: 0.1,
        manager: cc.Node,
        audioShoot: cc.AudioSource
    },

    onLoad() {
        this.maxX = 500;
        this.minX = -90;
        this.maxY = 160;
        this.minY = -320;

        this.shootTimer = 0;
        this.isShooting = false;
        this.state = 'idle';
        this.direction = cc.v2(0, 0);

        charactorManager.instance.register(this.id, this.node);
        this.charactorManager = this.manager.getComponent(charactorManager);

        this.changeState(this.state);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start() {
        this.bulletKeys = this.charactorManager.bulletKey;
        this.bulletKey = this.bulletKeys[0];
        this.bulletIndex = 0;
        mEmitter.instance.emit(Event.CURRENT_BULLET, {
            key: this.bulletKey,
            spineId: this.id
        });
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

        let newX = this.node.x + dt * this.speed * this.direction.x;
        let newY = this.node.y + dt * this.speed * this.direction.y;

        if (newX > this.maxX) newX = this.maxX;
        if (newX < this.minX) newX = this.minX;

        if (newY > this.maxY) newY = this.maxY;
        if (newY < this.minY) newY = this.minY;

        this.node.setPosition(newX, newY);
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
                this.changeBullet();
                break;
            }
            default:
                break;
        }
        this.updateAnimationState();
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

    changeBullet(key) {
        if (key) {
            this.bulletKey = key;
        } else {
            if (this.bulletKeys.length === 0) {
                return;
            }
            this.bulletIndex = (this.bulletIndex + 1) % this.bulletKeys.length;
            this.bulletKey = this.bulletKeys[this.bulletIndex];
        }
        mEmitter.instance.emit(Event.CURRENT_BULLET, {
            spineId: this.id,
            key: this.bulletKey
        });
    },

    shoot() {
        const positionFire = this.bulletManager.convertToNodeSpaceAR(this.shotPosition.convertToWorldSpaceAR(cc.v2(0, 0)));
        mEmitter.instance.emit(Event.SHOOT, {
            type: this.bulletKey,
            position: positionFire
        });
        this.audioShoot.play();
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

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
});
