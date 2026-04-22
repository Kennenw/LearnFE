import { CharacterController } from "../../../Controllers/CharacterController";
import { ICommand } from "../ICommand";

export class MoveUpCommand implements ICommand {
    execute(target: CharacterController): void {
        target.moveUp();
    }

    release(target: CharacterController): void {

    }
}



