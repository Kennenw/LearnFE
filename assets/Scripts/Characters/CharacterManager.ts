import { _decorator, Component, instantiate, Prefab } from 'cc';
import { CharacterController } from './CharacterController';
import { emitter } from '../Core/Events/Emitter';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
import { ITEMS } from '../Core/Constants/Item';
const { ccclass, property } = _decorator;

@ccclass('CharacterManager')
export class CharacterManager extends Component {
    @property([Prefab])
    characters: Prefab[] = [];

    private _prefabs: Map<string, Prefab> = new Map();
    private _character: CharacterController;
    private _onChooseBullet: (data: any) => void;
    private _onCharacterHit: (data: any) => void;
    private _onBuffCharacter: (data: any) => void;

    protected onLoad(): void {
        this.characters.forEach(prefab => {
            this._prefabs.set(prefab.name, prefab);
        });
        this._onChooseBullet = this.onChooseBullet.bind(this);
        emitter.on(GAME_EVENTS.CHOOSE_BULLET, this._onChooseBullet);
        this._onCharacterHit = this.onCharacterHit.bind(this);
        emitter.on(GAME_EVENTS.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
        this._onBuffCharacter = this.buffCharacter.bind(this);
        emitter.on(GAME_EVENTS.BUFF_CHARACTER, this._onBuffCharacter);
    }

    protected start(): void {
        const main = this.getMainCharacter();
        emitter.emit(GAME_EVENTS.CHANGED_CHARACTER, main);
    }

    getMainCharacter(name: string = 'Character'): CharacterController {
        if (this._character) {
            return this._character;
        } return this._spawn(name);
    }

    private buffCharacter(data: any) {
        switch (data.type) {
            case ITEMS.ITEM_HP:
                this._character.healHP(data.amount);
                emitter.emit(GAME_EVENTS.HEAL_CHARACTER, { maxHP: this._character.hp, currentHP: this._character._currentHp });
                break;
            case ITEMS.ITEM_DAMAGE:

                break;
            case ITEMS.ITEM_SPEED:

                break;
            default:
                break;
        }
    }

    private onChooseBullet(data: any) {
        this._character.setBulletType(data.type);
    }

    private _spawn(prefabName: string): CharacterController {
        const prefab = this._prefabs.get(prefabName);
        const node = instantiate(prefab);
        this._character = node.getComponent(CharacterController);
        node.parent = this.node;
        return this._character;
    }

    private onCharacterHit(data: any) {
        const hp = this._character.caculateDamage(data.damage);
        emitter.emit(GAME_EVENTS.CALCULATE_HP_PLAYER, { maxHP: hp.maxHP, currentHP: hp.currentHP });
    }

    protected onDestroy(): void {
        emitter.off(GAME_EVENTS.CHOOSE_BULLET, this._onChooseBullet);
        emitter.off(GAME_EVENTS.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
        emitter.off(GAME_EVENTS.BUFF_CHARACTER, this._onBuffCharacter);
    }
}

