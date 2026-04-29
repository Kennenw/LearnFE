import { _decorator, BlockInputEvents, Component, director, Label, Node, Toggle, tween } from 'cc';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('PopUpManager')
export class PopUpManager extends Component {

    @property(Node)
    pausePopup: Node;

    @property(Node)
    settingPopup: Node;

    @property(Node)
    losePopup: Node;

    @property(Node)
    winPopup: Node;

    @property([Label])
    scoreWins: Label[] = [];

    @property([Label])
    scoreLoses: Label[] = [];

    @property(Label)
    scoreBonus: Label;

    @property(Toggle)
    musicToggle: Toggle

    @property(Toggle)
    sfx: Toggle

    @property(Label)
    waveLabel: Label

    private static _instance: PopUpManager;
    private _bonusScore: number = 0;

    static get instance() {
        return this._instance;
    }

    protected onLoad(): void {
        if (PopUpManager._instance) {
            this.node.destroy();
            return;
        }
        PopUpManager._instance = this;
        director.addPersistRootNode(this.node);
        this.musicToggle.node.on(Toggle.EventType.TOGGLE, this.onMusicChanged, this);
        this.sfx.node.on(Toggle.EventType.TOGGLE, this.onSfxChanged, this);
    }

    protected onDestroy(): void {
        this.musicToggle.node.off(Toggle.EventType.TOGGLE, this.onMusicChanged, this);
        this.sfx.node.off(Toggle.EventType.TOGGLE, this.onSfxChanged, this);
    }

    onMusicChanged(toggle: Toggle) {
        AudioManager.instance.music.volume = toggle.isChecked ? 1 : 0;
        AudioManager.instance.playSfx();
    }

    onSfxChanged(toggle: Toggle) {
        AudioManager.instance.sfx.volume = toggle.isChecked ? 1 : 0;
        if (toggle.isChecked) {
            AudioManager.instance.playSfx();
        }
    }

    showPause(wave: string) {
        this._addBlockEvents(this.pausePopup);
        this.waveLabel.string = `${wave}`;
        this.pausePopup.active = true;
        director.pause();
    }

    hidePause() {
        this.pausePopup.active = false;
        this._removeBlockEvents(this.pausePopup);
        director.resume();
    }

    showSetting() {
        this._addBlockEvents(this.settingPopup);
        this.settingPopup.active = true;
        director.pause();

    }

    hideAll() {
        this.hidePause();
        this.hideLose();
        this.hideSetting();
        this.hideWin();
    }

    hideSetting() {
        this.settingPopup.active = false;
        this._removeBlockEvents(this.settingPopup);
        director.resume();
    }

    showWin(score: number, bonusScore: number) {
        this._bonusScore = bonusScore;
        this.winPopup.active = true;
        this.scoreWins.forEach(scoreWin => {
            scoreWin.string = score.toString();
        })

        this._addBlockEvents(this.winPopup);

        this.scheduleOnce(() => {
            this.scoreBonus.node.active = true;
            this.scoreBonus.string = `BONUS + ${this._bonusScore}`;
        }, 0.5);

        this.scheduleOnce(() => {

            this.schedule(() => {
                if (this._bonusScore <= 0) {
                    this.scoreBonus.node.active = false;
                    this.unscheduleAllCallbacks();
                    return;
                }

                this._bonusScore--;
                this.scoreBonus.string = `BONUS + ${this._bonusScore}`;
                score++;
                this.scoreWins.forEach(scoreWin => {
                    scoreWin.string = score.toString();
                });
            }, 0.00005)
        }, 0.5);
    }

    hideWin() {
        this.winPopup.active = false;
        this._removeBlockEvents(this.winPopup);
        director.resume();
    }

    showLose(score: string) {
        this.losePopup.active = true;
        this.scoreLoses.forEach(scoreLose => {
            scoreLose.string = score;
        })
        this._addBlockEvents(this.losePopup);
        director.pause();
    }

    hideLose() {
        this.losePopup.active = false;
        this._removeBlockEvents(this.losePopup);
        director.resume();
    }


    private _addBlockEvents(node: Node) {
        if (node.getComponents(BlockInputEvents)) {
            return;
        }
        node.addComponent(BlockInputEvents);
    }

    private _removeBlockEvents(node: Node) {
        const components = node.getComponents(BlockInputEvents)
        if (components) {
            components.forEach(component => {
                component.destroy();
            });
        }
    }

}

