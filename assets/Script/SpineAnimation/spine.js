const mEmitter = require("../mEmitter");

mEmitter
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad() {
        this.animation = this.setAnimation.bind(this);
        if (!mEmitter.instance) {
            mEmitter.instance = new mEmitter();
        }
        console.log("instance:", mEmitter.instance);
        mEmitter.instance.registerEvent('SET_ANIMATION', this.setAnimation.bind(this));
    },

    setAnimation(data) {
        this.node.getComponent(sp.Skeleton).setAnimation(0, data, true);
    }
});
