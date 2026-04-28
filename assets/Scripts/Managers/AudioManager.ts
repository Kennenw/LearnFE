import { _decorator, AudioSource, Component, director, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioSource)
    sfx: AudioSource

    @property(AudioSource)
    music: AudioSource

    @property(Slider)
    musicSlider: Slider

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

    onSlideMusic() {
        const value = this.musicSlider.progress;

        this.music.volume = value;
        this.sfx.volume = value;
        if (value <= 0) {
            this.music.pause();
        }
    }

    playMusic() {
        if (this.music.volume <= 0) {
            return;
        }
        this.music.play();
    }

    playSfx() {
        if (this.sfx.volume <= 0) {
            return;
        }
        this.sfx.play();
    }

    stopMusic() {
        this.music.pause();
    }

    stopSfx() {
        this.sfx.pause();
    }
}


