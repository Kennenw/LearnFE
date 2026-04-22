import { _decorator, Component, Node } from 'cc';
import { CharacterController } from '../Controllers/CharacterController';
import { ACTIONS } from '../Core/Constants/Input';
const { ccclass, property } = _decorator;

@ccclass('CharacterManager')
export class CharacterManager extends Component {

    protected onLoad(): void {
        this.register.bind(this);
    }
    private _controllers: Map<string, CharacterController> = new Map();

    register(id: string, controller: CharacterController) {
        this._controllers.set(id, controller);
    }

    get(id: string) {
        return this._controllers.get(id);
    }

    dispatch(id: string, action: string) {
        const controller = this._controllers.get(id);
        if (!controller) {
            return;
        }

        switch (action) {
            case ACTIONS.MOVE_LEFT:
                controller.moveLeft();
                break;
        
            default:
                break;
        }
    }
}

