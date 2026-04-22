import { CharacterManager } from "../../../Managers/CharacterManager";
import { ACTIONS } from "../../Constants/Input";
import { ICommand } from "../ICommand";

export class MoveLeftCommand implements ICommand {
    private _id: string;
    private _manager: CharacterManager;

    constructor(idCharacter: string, manager: CharacterManager) {
        this._id = idCharacter;
        this._manager = manager;
    }

    execute(): void {
        this._manager.dispatch(this._id, ACTIONS.MOVE_LEFT);
    }
}

