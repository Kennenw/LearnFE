import { CharacterController } from "../../Controllers/CharacterController";

export interface ICommand {
    execute(target: CharacterController): void;
    release(target: CharacterController): void;
}

