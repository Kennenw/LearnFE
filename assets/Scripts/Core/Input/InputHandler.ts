import { ICommand } from "./ICommand";

export class InputHandler {
    private _map = new Map<string, ICommand>();

    bind(key: string, command: ICommand) {
        this._map.set(key, command);
    }

    handle(key: string) {
        this._map.get(key).execute();
    }
}