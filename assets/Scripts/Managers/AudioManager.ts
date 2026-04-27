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
        this.music.volume = this.musicSlider.progress;
        this.sfx.volume = this.musicSlider.progress;
    }

    playMusic() {
        this.music.play();
    }

    playSfx() {
        this.sfx.play();
    }

    stopMusic() {
        this.music.pause();
    }

    stopSfx() {
        this.sfx.pause();
    }
}


