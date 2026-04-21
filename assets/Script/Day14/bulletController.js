const mEmitter = require("../mEmitter");
const { Event } = require("./constant");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 300,
        lifeTime: 2,
        damage: 200
    },

    onCollisionEnter(other) {
        mEmitter.instance.emit(Event.BULLET_HIT, {
            damage: this.damage,
            target: other
        })
        this.node.destroy();
    },

    update(dt) {
        this.node.x += this.speed * dt;
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            this.node.destroy();
        }
    }
});
