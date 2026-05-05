import { CharacterController } from  "../CharacterController";

export interface ICommand {
    execute(target: CharacterController): void;
    release(target: CharacterController): void;
}

