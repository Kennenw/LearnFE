import { _decorator, Component, director, instantiate, Prefab } from 'cc';
import { CharacterController } from '../Controllers/CharacterController';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('CharacterManager')
export class CharacterManager extends Component {
    @property([Prefab])
    characters: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _character: CharacterController;

    protected onLoad(): void {
        this.characters.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        });
    }

    protected start(): void {
        const main = this.getMainCharacter();
        emitter.emit(GameEvents.CHANGED_CHARACTER, main);
    }

    getMainCharacter(name: string = 'Character'): CharacterController {
        if (this._character) {
            return this._character;
        } return this._spawn(name);

    }

    pause() {
        director.pause();
    }

    resume() {
        director.resume();
    }

    private _spawn(prefabName: string): CharacterController {
        const prefab = this._prefabs.get(prefabName);
        const node = instantiate(prefab);
        this._character = node.getComponent(CharacterController);
        node.parent = this.node;
        return this._character;
    }
}

