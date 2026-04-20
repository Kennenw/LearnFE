const mEmitter = require("../mEmitter");
const { Event } = require("./constant");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        spine: sp.Skeleton
    },

    onLoad() {
        this.direction = cc.v2(0, 0);
        if (!mEmitter.instance) {
            mEmitter.instance = new mEmitter();
        }
        mEmitter.instance.registerEvent(Event.KEY_DOWN, this.onKeyDown.bind(this))
    },

    onKeyDown(event) {
        console.log('even', event);
        if(event.keyCode === cc.macro.KEY.left){
            this.direction.x = -1;
        }
    },

    setAnimation(event) {

    },

    update(dt) {
        this.node.setPosition(
            this.node.x + dt * this.speed * this.direction.x,
            this.node.y + dt * this.speed * this.direction.y
        )
    },
});
