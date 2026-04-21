const mEmitter = require("../mEmitter");
const buttonController = require("./buttonController");
const { Event } = require("./constant");

cc.Class({
    extends: cc.Component,

    properties: {
        bulletIcons: {
            type: [cc.SpriteFrame],
            default: []
        },
        bulletButtonPrefab: cc.Prefab,
        content: cc.Node,
    },

    onLoad() {
        this.buttons = [];
        this.content.removeAllChildren();
        this.bulletIcons.forEach((bulletIcon, index) => {
            const item = cc.instantiate(this.bulletButtonPrefab);
            this.content.addChild(item);
            const controller = item.getComponent(buttonController);
            controller.init(index, bulletIcon);
            this.buttons.push(controller);
        });

        this._onChangeBullet = this.onChangeBullet.bind(this);
        mEmitter.instance.registerEvent(Event.CURRENT_BULLET, this._onChangeBullet);
    },

    onChangeBullet(data) {
        const selectedKey = data.key;

        this.buttons.forEach((button, index) => {
            button.setSelected(index === selectedKey, data.spineId);
        });
    }
});
