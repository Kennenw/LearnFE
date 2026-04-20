cc.Class({
    extends: cc.Component,

    properties: {
        spineNodes: {
            type: [cc.Node],
            default: []
        }
    },

    onLoad() {
        this.spines = new Map();

    },

    register(id, skeleton) {
        this.spines.set(id, skeleton);
    },

    play(id, animation, loop = true) {
        const skeleton = this.spines.get(id);
        skeleton.setAnimation(0, animation, loop);
    }
});
