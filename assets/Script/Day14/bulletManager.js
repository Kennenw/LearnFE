const mEmitter = require("../mEmitter");
const { Event } = require("./constant");
const bulletManager = cc.Class({
    extends: cc.Component,

    properties: {
        bullets: {
            type: [cc.Prefab],
            default: []
        },
    },

    statics: {
        instance: null
    },

    onLoad() {
        if (bulletManager.instance === null) {
            bulletManager.instance = this;
        }
        this.bulletTypes = new Map();
        this.bullets.forEach((bullet, index) => {
            if (!this.bulletTypes.get(index)) {
                this.bulletTypes.set(index, bullet);
            }
        })

        this._onShoot = this.onShoot.bind(this);
        mEmitter.instance.registerEvent(Event.SHOOT, this._onShoot);

        this.arrayBulletKey = Array.from(this.bulletTypes.keys());
        mEmitter.instance.emit(Event.LIST_KEY_BULLET, this.arrayBulletKey);
    },

    onShoot(data) {
        const bullet = this.bulletTypes.get(data.type);
        const node = cc.instantiate(bullet);
        node.setPosition(data.position);
        this.node.addChild(node);
    },
});

module.exports = bulletManager;
