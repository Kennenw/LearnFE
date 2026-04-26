import { _decorator, AudioSource, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioSource)
    pfx: AudioSource

    @property(AudioSource)
    music: AudioSource

    private static _instance: AudioManager;

    static get instance() {
        return this._instance;
    }

    protected onLoad(): void {
        if (!AudioManager._instance) {
            AudioManager._instance = this;
            director.addPersistRootNode(this.node);
        }
    }

    playMusic() {
        this.music.play();
    }

    playPfx() {
        this.pfx.play();
    }

    stopMusic() {
        this.music.pause();
    }

    stopPfx() {
        this.pfx.pause();
    }
}


