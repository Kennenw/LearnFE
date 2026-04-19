cc.Class({
    extends: cc.Component,

    properties: {
        spine: cc.Node,
        animationButton: cc.Prefab
    },

    onLoad() {
        console.log("TEST RUNNING");
        this.node.removeAllChildren();
        this.animationButtons = [];
        let spineNode = this.spine;
        console.log('spine: ', spineNode);
        let skeleton = spineNode.getComponent(sp.Skeleton);
        console.log('skeleno: ', skeleton);
        this.animationButtons = skeleton._skeleton.data.animations || [];
        console.log("animations:", this.animationButtons);
        let animationsLength = this.animationButtons.length;
        for (let index = 0; index < animationsLength; index++) {
            const item = cc.instantiate(this.animationButton);
            item.parent = this.node;
            item.getComponentInChildren(cc.Label).string = this.animationButtons[index].name;
            item.name = this.animationButtons[index].name;
        }
    }
});
