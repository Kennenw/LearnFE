import { _decorator, Component, EventKeyboard, EventMouse, Input, input, KeyCode } from "cc";
import { ICommand } from "./ICommand";
import { MoveLeftCommand } from "./Commands/MoveLeftCommand";
import { CharacterManager } from "../../Managers/CharacterManager";
import { MoveRightCommand } from "./Commands/MoveRightCommand";
import { MoveUpCommand } from "./Commands/MoveUpCommand";
import { MoveDownCommand } from "./Commands/MoveDownCommand";
import { ShootCommand } from "./Commands/ShootCommand";
const { ccclass } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
    private _map = new Map<number, ICommand>();
    private _holdingKeys = new Set<number>();

    bind(key: number, command: ICommand) {
        this._map.set(key, command);
    }

    protected onLoad(): void {
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
        const target = CharacterManager.instance.getMainCharacter();
        this._holdingKeys.forEach((key) => {
            const command = this._map.get(key);
            command.execute(target);
        })
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseDown(event: EventMouse) {
        const command = this._map.get(EventMouse.BUTTON_LEFT);
        if (!command) {
            return;
        }

        if (!this._holdingKeys.has(EventMouse.BUTTON_LEFT)) {
            this._holdingKeys.add(EventMouse.BUTTON_LEFT);
            const target = CharacterManager.instance.getMainCharacter();
            command.execute(target);
        }
    }

    onMouseUp(event: EventMouse) {
        const command = this._map.get(EventMouse.BUTTON_LEFT);
        if (!command) {
            return;
        }
        this._holdingKeys.delete(EventMouse.BUTTON_LEFT);
        const target = CharacterManager.instance.getMainCharacter();
        command.release(target);
    }

    onKeyDown(event: EventKeyboard) {
        const command = this._map.get(event.keyCode);
        if (!command) {
            return;
        }

        if (!this._holdingKeys.has(event.keyCode)) {
            this._holdingKeys.add(event.keyCode);
            const target = CharacterManager.instance.getMainCharacter();
            command.execute(target);
        }
    }

    onKeyUp(event: EventKeyboard) {
        const command = this._map.get(event.keyCode);
        if (!command) {
            return;
        }
        this._holdingKeys.delete(event.keyCode);
        const target = CharacterManager.instance.getMainCharacter();
        command.release(target);
    }
}