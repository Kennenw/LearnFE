const mEmitter = require("../mEmitter");
const { Event } = require("./constant");
const monsterController = require("./monsterController");


const monsterManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad() {
        this._onUpdateHP = this.onUpdateHP.bind(this);
        mEmitter.instance.registerEvent(Event.BULLET_HIT, this._onUpdateHP)
    },

    onUpdateHP(data) {
        const monsterImpact = data.target.node;
        const controller = monsterImpact.getComponent(monsterController);
        controller.takeDamage(data.damage);
    },
});

module.exports = monsterManager;