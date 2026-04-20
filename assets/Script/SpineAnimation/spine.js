const mEmitter = require("../mEmitter");

mEmitter
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad() {
        this.positonX = this.node.x;
        this.positonY = this.node.y;
        this.scale = this.node.scale;
        this.rotation = this.node.angle;
        this.spine = this.node.getComponent(sp.Skeleton);

        if (!mEmitter.instance) {
            mEmitter.instance = new mEmitter();
        }
        console.log("instance:", mEmitter.instance);
        mEmitter.instance.registerEvent('SET_ANIMATION', this.setAnimation.bind(this));
        mEmitter.instance.registerEvent('SET_TIMELINE', this.setTimeline.bind(this));
        mEmitter.instance.registerEvent('SET_RUN_ACTION', this.setRunAction.bind(this));
        mEmitter.instance.registerEvent('SET_TWENS', this.setTwens.bind(this));
    },

    setClearState() {
        this.node.stopAllActions();
        this.node.setPosition(this.positonX, this.positonY);
        this.node.setScale(this.scale);
        this.node.angle = this.rotation;
        this.spine.setToSetupPose();
        let animation = this.node.getComponent(cc.Animation);
        if (animation) animation.stop();
    },

    setAnimation(data) {
        this.node.getComponent(sp.Skeleton).setAnimation(0, data, true);
        console.log('animation', this.node.getComponent(sp.Skeleton));
    },

    setTimeline() {
        this.setClearState();
        let timeline = this.node.getComponent(cc.Animation);
        console.log('timeline', timeline);
        timeline.play('Timeline');
    },

    setRunAction() {
        this.setClearState();
        var action = cc.repeatForever(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(1, 500, 0).easing(cc.easeIn(5)),
                    cc.sequence(
                        cc.scaleTo(0.5, 1, 1),
                        cc.scaleTo(0.5, 0.5, 0.5)
                    )
                ).speed(2),
                cc.rotateTo(1, 180),
                cc.delayTime(1),
                cc.rotateTo(1, 360),
                cc.spawn(
                    cc.moveTo(1, -500, -273).easing(cc.easeIn(5)),
                    cc.sequence(
                        cc.scaleTo(0.5, -1, 1),
                        cc.scaleTo(0.5, -0.5, 0.5)
                    )
                )
            )
        )
        this.node.runAction(action);
    },

    setTwens() {
        this.setClearState();
        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(1, { x: 500, rotation: -45 }, { easing: 'easeInQuint' })
                    .parallel(
                        cc.tween()
                            .to(1, { x: -500 }),
                        cc.tween()
                            .to(0.5, { scaleX: -0.5 })
                    )
                    .to(0, { scaleX: 0.5, rotation: -45 })
            )
            .start();
    },
});
