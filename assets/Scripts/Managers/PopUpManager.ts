import { _decorator, BlockInputEvents, Component, director, Label, Node, Toggle } from 'cc';
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

    @property(Label)
    scoreWin: Label

    @property(Label)
    scoreLose: Label

    @property(Toggle)
    musicToggle: Toggle

    @property(Toggle)
    pfx: Toggle

    private static _instance: PopUpManager;

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
        this.pfx.node.on(Toggle.EventType.TOGGLE, this.onSfxChanged, this);
    }

    protected onDestroy(): void {
        this.musicToggle.node.off(Toggle.EventType.TOGGLE, this.onMusicChanged, this);
        this.pfx.node.off(Toggle.EventType.TOGGLE, this.onSfxChanged, this);
    }

    onMusicChanged(toggle: Toggle) {
        AudioManager.instance.music.volume = toggle.isChecked ? 1 : 0;
    }

    onSfxChanged(toggle: Toggle) {
        AudioManager.instance.pfx.volume = toggle.isChecked ? 1 : 0;
    }

    showPause() {
        this.pausePopup.active = true;
        this._addBlockEvents(this.pausePopup);
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

    showWin(score: string) {
        this.winPopup.active = true;
        this.scoreWin.string = score;
        this._addBlockEvents(this.winPopup);
        director.pause();
    }

    hideWin() {
        this.winPopup.active = false;
        this._removeBlockEvents(this.winPopup);
        director.resume();
    }

    showLose(score: string) {
        this.losePopup.active = true;
        this.scoreLose.string = score;
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

