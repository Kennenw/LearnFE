cc.Class({
    extends: cc.Component,

    properties: {
        speed: 300,
        lifeTime: 2,
        id: 0
    },

    onEnable() {
        this.scheduleOnce(this.despawn.bind(this), this.lifeTime);
    },

    onCollisionEnter() {
        this.despawn();
    },

    despawn() {
        this.unscheduleAllCallbacks();
        this.node.destroy();
    },

    update(dt) {
        this.node.x += this.speed * dt;
    }
});
