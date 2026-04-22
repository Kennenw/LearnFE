import { _decorator, Component, Node, sp } from 'cc';
import { CharacterManager } from '../Managers/CharacterManager';
import { AnimationStateMachine } from '../Core/StateMachines/AnimationStateMachine';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property
    speed: number = 5;

    @property(sp.Skeleton)
    spine!: sp.Skeleton;

    @property
    id: string = '1';

    private _animation: AnimationStateMachine;

    protected start(): void {
        CharacterManager.instance.register(this.id, this);
        this._animation = new AnimationStateMachine(this.spine);
    }

    moveLeft() {
        this._animation.run();
    }

    moveDown() {
        this._animation.idle();
    }

    moveUp() {
        this._animation.dead();
    }

    moveRight() {
        console.log("move moveRight");
    }

    shoot() {
    }
}

