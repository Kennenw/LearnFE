import { _decorator, Component, EPhysics2DDrawFlags, PhysicsSystem2D } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    protected onLoad(): void {
        PhysicsSystem2D.instance.enable = true;
        //PhysicsSystem2D.instance.debugDrawFlags = 1;
    }
}


