import { CharacterController } from "../../../Controllers/CharacterController";
import { ICommand } from "../ICommand";

export class MoveRightCommand implements ICommand {
    execute(target: CharacterController): void {
        target.moveRight();
    }

    release(target: CharacterController): void {

    }
}


