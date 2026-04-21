const mEmitter = require("../mEmitter");
const { Event } = require("./constant");

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
        this.bulletKey = [];
        if (charactorManager.instance === null) {
            charactorManager.instance = this;
        }
        this.spines = new Map();
        this._onKeyBullets = this.onKeyBullets.bind(this);
        mEmitter.instance.registerEvent(Event.LIST_KEY_BULLET, this._onKeyBullets);
    },

    onKeyBullets(data) {
        this.bulletKey = data;
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
