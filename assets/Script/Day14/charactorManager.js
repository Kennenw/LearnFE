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

        this._onChangeBullet = this.onChangeBullet.bind(this);
        mEmitter.instance.registerEvent(Event.CHANGE_BULLET, this._onChangeBullet);
    },

    onChangeBullet(data) {
        const node = this.spines.get(data.spineId);
        if (!node) {
            return;
        }
        const controller = node.getComponent('charactorController');
        controller.changeBullet(data.key);
    },

    onKeyBullets(data) {
        this.bulletKey = data;
    },

    register(id, node) {
        if (!this.spines.get(id)) {
            this.spines.set(id, node);
        }
    },

    play(id, animation, layout = 0,loop = true) {
        const node = this.spines.get(id);
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.setAnimation(layout, animation, loop);
    },
});

module.exports = charactorManager;
