import { CharacterController } from "../../../Controllers/CharacterController";
import { ICommand } from "../ICommand";

export class MoveLeftCommand implements ICommand {

    execute(target: CharacterController): void {
        target.moveLeft();
    }

    release(target: CharacterController): void {
        target.moveLeft(false);
    }
}

