const charactorManager = cc.Class({
    extends: cc.Component,

    properties: {
        spineNodes: {
            type: [cc.Node],
            default: []
        }
    },

    statics: {
        instance: null
    },

    onLoad() {
        if (charactorManager.instance === null) {
            charactorManager.instance = this;
        }
        this.spines = new Map();
    },

    register(id, skeleton) {
        if (!this.spines.get(id)) {
            this.spines.set(id, skeleton);
        }
    },

    play(id, animation, loop = true) {
        const skeleton = this.spines.get(id);
        skeleton.setAnimation(0, animation, loop);
    },
});

module.exports = charactorManager;
