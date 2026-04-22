import { _decorator, Component, Node } from 'cc';
import { CharacterController } from '../Controllers/CharacterController';
const { ccclass, property } = _decorator;

@ccclass('CharacterManager')
export class CharacterManager extends Component {

    @property
    mainCharacter: string = '';

    private _controllers: Map<string, CharacterController> = new Map();

    static instance: CharacterManager;

    protected onLoad(): void {
        if (!CharacterManager.instance) {
            CharacterManager.instance = this;
        }
    }

    register(id: string, controller: CharacterController) {
        this._controllers.set(id, controller);
    }

    getMainCharacter(): CharacterController {
        return this._controllers.get(this.mainCharacter)
            ?? this._controllers.values().next().value;
    }

}

