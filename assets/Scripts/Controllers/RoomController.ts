import { _decorator, Component, Label, Node, ProgressBar, v3 } from 'cc';
import { CharacterManager } from '../Managers/CharacterManager';
import { EnemyManager } from '../Managers/EnemyManager';
import { CharacterController } from './CharacterController';
import { GameEvents } from '../Core/Constants/GameEvents';
import { emitter } from '../Core/Events/Emitter';
import { WAVE_ROOM } from '../Core/Constants/Common';
const { ccclass, property } = _decorator;

@ccclass('RoomController')
export class RoomController extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar

    @property(Label)
    time: Label

    @property
    maxTime: number = 120

    @property(Label)
    wave: Label

    private _charactorManager: CharacterManager;
    private _enemyManager: EnemyManager;
    private _character: CharacterController;
    private _onCharacterHit: (data: any) => void;
    private _isWave: boolean = false
    private _currentHp: number;

    init() {
        this._charactorManager = this.node.getComponentInChildren(CharacterManager);
        this._enemyManager = this.node.getComponentInChildren(EnemyManager);
        this._character = this._charactorManager.getMainCharacter();
        this._enemyManager._target = this._character.node;

        this._onCharacterHit = this.onCharacterHit.bind(this);
        emitter.on(GameEvents.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
        this.wave.string = WAVE_ROOM.WAVE_01;
        this._currentHp = this._character.hp;
    }

    createWave() {
        if (this._isWave === false) {
            this.schedule(() => {
                this._enemyManager.spawn(this._character.node.worldPosition);
            }, 5, 10);
            this._isWave = true;
        }
    }

    protected update(dt: number): void {
        this.maxTime -= dt / 2;
        this.time.string = Math.floor(this.maxTime).toString();
        this.createWave();
    }

    onCharacterHit(data: any) {
        this._updateProgressBar(data.damage);
        if (this.progressBar.progress <= 0) {
            this._character.death();
        }
    }

    private _updateProgressBar(damge: number) {
        this._currentHp = Math.max(this._currentHp - damge, 0);
        this.progressBar.progress = this._currentHp / this._character.hp;
    }


    onPause() {
        this._charactorManager.pause();
        this._enemyManager.pause();
    }

    onResume() {
        this._charactorManager.resume();
        this._enemyManager.resume();
    }


    onQuit() {
        this.node.destroy();
        this.node = null;
        emitter.emit(GameEvents.LOBBY_START);
    }
}


