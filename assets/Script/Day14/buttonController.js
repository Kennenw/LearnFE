const mEmitter = require("../mEmitter");
const { Event } = require("./constant");

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Node,
        selectedNode: cc.Node,
    },

    onLoad() {
        this.icon = this.sprite.getComponent(cc.Sprite);
        this.button = this.selectedNode.getComponent(cc.Button);
    },

    init(key, spriteFrame) {
        this.key = key;
        this.icon.spriteFrame = spriteFrame;
    },

    setSelected(isSelected, spineId) {
        this.spineId = spineId;
        const target = this.button.target;
        if (isSelected) {
            target.setScale(0.9);
            target.opacity = 180;
        } else {
            target.setScale(1);
            target.opacity = 255;
        }
    },

    onClick() {
        mEmitter.instance.emit(Event.CHANGE_BULLET, {
            key: this.key,
            spineId: this.spineId
        });
    }
});
