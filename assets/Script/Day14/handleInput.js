const mEmitter = require('../mEmitter');
const {Event} = require('./constant');

cc.Class({
    extends: cc.Component,

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown(event) {
        mEmitter.instance.emit(Event.KEY_DOWN, event);
    },

    onKeyUp(event) {
        mEmitter.instance.emit(Event.KEY_UP, event);
    },
});
