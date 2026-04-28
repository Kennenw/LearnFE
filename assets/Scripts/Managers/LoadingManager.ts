import { _decorator, Component, director, ProgressBar, Node, Label, Slider } from 'cc';
import { SceneManager } from './SceneManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar

    @property(Slider)
    slider: Slider

    @property([Node])
    backgrounds: Node[] = [];

    @property(Label)
    loading: Label

    private static _instance: LoadingManager;

    static get instance() {
        return this._instance;
    }

    protected onLoad(): void {
        if (!LoadingManager._instance) {
            LoadingManager._instance = this;
        }
        this._randomBackground();
    }

    protected start(): void {
        this.progressBar.progress = 0;
        this.slider.progress = 0;
        this.slider.enabled = false;
        const target = SceneManager.nextScene || "Lobby";
        director.preloadScene(target, (completed, total) => {
            const progress = completed / total;
            this.progressBar.progress = Math.max(this.progressBar.progress, progress);
            this.slider.progress = Math.max(this.progressBar.progress, progress);
            this.loading.string = `Loading... ${Math.floor(this.progressBar.progress * 100)}%`
        }, () => {
            this.scheduleOnce(() => {
                director.loadScene(target);
            }, 0.3);
        })
    }

    private _randomBackground() {
        const total = this.backgrounds.length;
        const random = Math.floor(Math.random() * (total));
        this.backgrounds.forEach(background => {
            if (this.backgrounds[random] === background) {
                background.active = true;
                return;
            }
        });
    }
}


