const mEmitter = require("../mEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    runTimeline(){
        mEmitter.instance.emit('SET_TIMELINE');
    },
    runAction(){
        mEmitter.instance.emit('SET_RUN_ACTION');
    },
    runTwens(){
        mEmitter.instance.emit('SET_TWENS');
    },
    clearEvent(){
        mEmitter.instance.removeALlEvents();
    }
});
