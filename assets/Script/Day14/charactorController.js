
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        id: 0,
        bulletType: 1,
        bulletManager: cc.Node,
        shotPosition: cc.Node,
        shootCooldown: 0.5
    },

    onLoad() {
        this.isShooting = false;
        this.shootTimer = 0;
        this.state = 'idle';
        this.direction = cc.v2(0, 0);
        this.bullet = this.bulletManager.getComponent('bulletManager');
        this.spineManager = this.node.parent.getComponent('spineManager');

        const skeleton = this.node.getComponent(sp.Skeleton);
        this.spineManager.register(this.id, skeleton);

        this.playAnimation(this.state);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    update(dt) {
        this.node.setPosition(
            this.node.x + dt * this.speed * this.direction.x,
            this.node.y + dt * this.speed * this.direction.y
        );

        if (!this.isShooting) {
            this.shootTimer -= dt;
            if (this.shootTimer <= 0) {
                this.isShooting = true;
            }
        }
    },

    shoot() {
        const positionFire = this.bulletManager.convertToNodeSpaceAR(this.shotPosition.convertToWorldSpaceAR(cc.v2(0, 0)));
        this.bullet.fire(this.bulletType, positionFire);
        this.isShooting = false;
        this.shootTimer = this.shootCooldown;
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    playAnimation(animation) {
        if (this.spineManager) {
            this.spineManager.play(this.id, animation);
        }
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
                this.shoot();
                this.changeState('shoot');
                return;
            }
            default:
                break;
        }
        this.updateMoveState();
    },

    updateMoveState() {
        const isMoving = this.direction.x !== 0 || this.direction.y !== 0;
        const state = isMoving ? 'walk' : 'idle';

        this.changeState(state);
    },

    changeState(newState) {
        if (newState !== this.state) {
            this.state = newState;
            this.playAnimation(this.state);
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
                this.updateMoveState();
                break;
            }
            default:
                break;
        }
        this.updateMoveState();
    },
});
