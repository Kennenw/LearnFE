const monsterController = cc.Class({
    extends: cc.Component,

    properties: {
        hp: 100,
        speeds: 13,
        timeBack: 5,
        progressBar: cc.ProgressBar,
        damagePrefab: cc.Prefab
    },

    onLoad() {
        this.directionY = -1;
        this.currentTime = this.timeBack;
    },

    update(dt) {
        this.currentTime -= dt;
        if (this.currentTime <= 0) {
            this.directionY *= -1;
            this.currentTime = this.timeBack;
        }
        this.node.y += dt * this.speeds * this.directionY;
    },

    takeDamage(damage) {
        this.hp -= damage;
        this._updateProgressBar();
        this.showDamage(damage);
    },

    showDamage(damage) {
        const label = cc.instantiate(this.damagePrefab);
        label.parent = this.node.parent;
        label.position = this.node.position;
        label.getComponent(cc.Label).string = `- ${damage}`;

        cc.tween(label)
            .by(0.5, { y: 50 })
            .call(() => {
                label.destroy();
            })
            .start();
    },

    _updateProgressBar() {
        if (this.hp <= 0) {
            this.directionY = 0;
            setTimeout(() => {
                this.node.active = false;
            }, 1500);
        }
        this.progressBar.progress = this.hp / 100;
    }
});

module.exports = monsterController;