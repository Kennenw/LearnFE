cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        progressBar: cc.ProgressBar,
        nameCharactor: "",
        label: cc.Label,
        animation: sp.Skeleton,
    },

    onLoad() {
        this.progressBar.progress = 1;
        this.moveX = 0;
        this.label.string = this.nameCharactor;
        this.isAnimation = false;
    },

    start() {

    },

    update(dt) {
        this._updateProgressBar(this.progressBar, dt);
        this.node.x += this.moveX * this.speed * dt;
        if (this.moveX !== 0 && this.isAnimation === false) {
            this.isAnimation = true;
            this.animation.setAnimation(0, 'walk', true);
        }
        if (this.moveX > 0) {
            this.node.setScale(0.5, 0.5);
            if (this.node.scaleX > 0) {
                this.label.node.setScale(1, 1);
            }
        } else if (this.moveX < 0) {
            this.node.setScale(-0.5, 0.5);
            if (this.node.scaleX < 0) {
                this.label.node.setScale(-1, 1);
            }
        }
    },


    _updateProgressBar(progressBar, dt) {
        let progress = progressBar.progress;
        if (this.moveX !== 0) {
            progress -= dt * 0.5;
        }
        if (progress <= 0) {
            if (this.isAnimation === true) {
                this.animation.setAnimation(0, 'death', true);
                this.isAnimation = false;
            }
            this.moveX = 0;
            setTimeout(() => {
                this.node.active = false;
            }, 3000);
        }
        progressBar.progress = Math.max(0, progress);
    },

    moveRight() {
        this.moveX = 1;
    },

    moveLeft() {
        this.moveX = -1;
    },

    stopMove() {
        this.moveX = 0;
        this.animation.setAnimation(0, 'idle', true);
        this.isAnimation = false;
    }
});
