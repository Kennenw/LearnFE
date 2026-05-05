import { CharacterController } from  "../../CharacterController";
import { ICommand } from "../ICommand";

export class ShootCommand implements ICommand {
    execute(target: CharacterController): void {
        target.shoot();
    }

    release(target: CharacterController): void {
        target.shoot(false);
    }
}



