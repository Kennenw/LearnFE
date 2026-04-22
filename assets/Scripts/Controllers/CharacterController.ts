import { _decorator, Component, Node } from 'cc';
import { CharacterManager } from '../Managers/CharacterManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property
    speed: number = 5;

    @property
    id: string = '1';

    protected start(): void {
        CharacterManager.register(this.id, this);
    }

    moveLeft() {
        console.log("move Left");
    }
}

