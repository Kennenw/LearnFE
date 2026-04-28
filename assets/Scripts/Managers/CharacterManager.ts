import { _decorator, Component, instantiate, Prefab } from 'cc';
import { CharacterController } from '../Controllers/CharacterController';
import { emitter } from '../Core/Events/Emitter';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('CharacterManager')
export class CharacterManager extends Component {
    @property([Prefab])
    characters: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _character: CharacterController;
    private _onChooseBullet: (data: any) => void;

    protected onLoad(): void {
        this.characters.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        });
        this._onChooseBullet = this.onChooseBullet.bind(this);
        emitter.on(GAME_EVENTS.CHOOSE_BULLET, this._onChooseBullet);
    }

    protected start(): void {
        const main = this.getMainCharacter();
        emitter.emit(GAME_EVENTS.CHANGED_CHARACTER, main);
    }

    protected onDestroy(): void {
        emitter.off(GAME_EVENTS.CHOOSE_BULLET, this._onChooseBullet);
    }

    getMainCharacter(name: string = 'Character'): CharacterController {
        if (this._character) {
            return this._character;
        } return this._spawn(name);

    }

    private onChooseBullet(data: any) {
        this._character.bulletType = data.type;
    }

    private _spawn(prefabName: string): CharacterController {
        const prefab = this._prefabs.get(prefabName);
        const node = instantiate(prefab);
        this._character = node.getComponent(CharacterController);
        node.parent = this.node;
        return this._character;
    }
}

