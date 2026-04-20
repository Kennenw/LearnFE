const mEmitter = require("../mEmitter");

cc.Class({
    extends: cc.Component,

    onClick() {
        console.log("CLICK");
        mEmitter.instance.emit('SET_ANIMATION', run);
    }

});
