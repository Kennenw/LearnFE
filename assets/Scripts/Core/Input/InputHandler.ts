import { _decorator, Component, EventKeyboard, EventMouse, Input, input, KeyCode } from "cc";
import { ICommand } from "./ICommand";
import { MoveLeftCommand } from "./Commands/MoveLeftCommand";
import { MoveRightCommand } from "./Commands/MoveRightCommand";
import { MoveUpCommand } from "./Commands/MoveUpCommand";
import { MoveDownCommand } from "./Commands/MoveDownCommand";
import { ShootCommand } from "./Commands/ShootCommand";
import { CharacterController } from "../../Controllers/CharacterController";
import { emitter } from "../Events/Emitter";
import { GAME_EVENTS } from "../Constants/GameEvents";
const { ccclass } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
    private _map = new Map<number, ICommand>();
    private _holdingKeys = new Set<number>();
    private _tagert: CharacterController;

    bind(key: number, command: ICommand) {
        this._map.set(key, command);
    }

    protected onLoad(): void {
        emitter.on(GAME_EVENTS.CHANGED_CHARACTER, this._onCharacterChanged.bind(this));
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    protected start(): void {
        this.bind(KeyCode.ARROW_LEFT, new MoveLeftCommand());
        this.bind(KeyCode.KEY_A, new MoveLeftCommand());

        this.bind(KeyCode.ARROW_RIGHT, new MoveRightCommand());
        this.bind(KeyCode.KEY_D, new MoveRightCommand());

        this.bind(KeyCode.KEY_W, new MoveUpCommand());
        this.bind(KeyCode.ARROW_UP, new MoveUpCommand());

        this.bind(KeyCode.KEY_S, new MoveDownCommand());
        this.bind(KeyCode.ARROW_DOWN, new MoveDownCommand());

        this.bind(KeyCode.SPACE, new ShootCommand());
        this.bind(EventMouse.BUTTON_LEFT, new ShootCommand());
    }

    protected update(dt: number): void {
        this._holdingKeys.forEach((key) => {
            const command = this._map.get(key);
            command.execute(this._tagert);
        })
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        emitter.off(GAME_EVENTS.CHANGED_CHARACTER, this._onCharacterChanged.bind(this));
    }

    private _onCharacterChanged = (c: CharacterController) => {
        this._tagert = c;
    };

    onMouseDown() {
        const command = this._map.get(EventMouse.BUTTON_LEFT);
        if (!command) {
            return;
        }

        if (!this._holdingKeys.has(EventMouse.BUTTON_LEFT)) {
            this._holdingKeys.add(EventMouse.BUTTON_LEFT);
            command.execute(this._tagert);
        }
    }

    onMouseUp() {
        const command = this._map.get(EventMouse.BUTTON_LEFT);
        if (!command) {
            return;
        }
        this._holdingKeys.delete(EventMouse.BUTTON_LEFT);
        command.release(this._tagert);
    }

    onKeyDown(event: EventKeyboard) {
        const command = this._map.get(event.keyCode);
        if (!command) {
            return;
        }

        if (!this._holdingKeys.has(event.keyCode)) {
            this._holdingKeys.add(event.keyCode);
            command.execute(this._tagert);
        }
    }

    onKeyUp(event: EventKeyboard) {
        const command = this._map.get(event.keyCode);
        if (!command) {
            return;
        }
        this._holdingKeys.delete(event.keyCode);
        command.release(this._tagert);
    }
}