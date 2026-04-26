import { _decorator, Component, director, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {

    private static _instance: SceneManager;
    static nextScene: string = "";

    static get instance() {
        return this._instance;
    }

    protected onLoad(): void {
        PhysicsSystem2D.instance.enable = true;

        if (!SceneManager._instance) {
            SceneManager._instance = this;
        }
        director.loadScene('Loading');
    }

    loadScene(name: string = 'Lobby') {
        SceneManager.nextScene = name;
        director.loadScene('Loading');
    }
}


