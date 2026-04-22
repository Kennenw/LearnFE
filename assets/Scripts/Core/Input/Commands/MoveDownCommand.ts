import { CharacterController } from '../../../Controllers/CharacterController';
import { ICommand } from '../ICommand';

export class MoveDownCommand implements ICommand {

    execute(target: CharacterController): void {
        target.moveDown();
    }

    release(target: CharacterController): void {
        target.moveDown(false);
    }
}


