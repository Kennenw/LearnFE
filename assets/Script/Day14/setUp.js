cc.Class({
    extends: cc.Component,

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
    }
});
