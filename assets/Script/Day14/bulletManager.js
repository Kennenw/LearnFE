cc.Class({
    extends: cc.Component,

    properties: {
        bullets: {
            type: [cc.Prefab],
            default: []
        },
    },

    fire(type, position) {
        const bullet = cc.instantiate(this.bullets[type]);
        bullet.setPosition(position);
        this.node.addChild(bullet);
    }
});
