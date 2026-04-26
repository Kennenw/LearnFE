import { _decorator, Button, Component, Label, ProgressBar } from 'cc';
import { CharacterManager } from '../Managers/CharacterManager';
import { EnemyManager } from '../Managers/EnemyManager';
import { CharacterController } from './CharacterController';
import { GameEvents } from '../Core/Constants/GameEvents';
import { emitter } from '../Core/Events/Emitter';
import { WAVE_ROOM } from '../Core/Constants/Common';
import { PopUpManager } from '../Managers/PopUpManager';
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

    @property(Label)
    score: Label

    private _charactorManager: CharacterManager;
    private _enemyManager: EnemyManager;
    private _character: CharacterController;
    private _onCharacterHit: (data: any) => void;
    private _onCalculatePoint: (data: any) => void;
    private _isWave: boolean = false
    private _currentHp: number;
    private _currentScore: number = 0;
    private _popUp: PopUpManager;
    private _totalEnemy: number = 0;

    init() {
        this._popUp = PopUpManager.instance;
        this._charactorManager = this.node.getComponentInChildren(CharacterManager);
        this._enemyManager = this.node.getComponentInChildren(EnemyManager);
        this._character = this._charactorManager.getMainCharacter();
        this._enemyManager._target = this._character.node;
        this.wave.string = WAVE_ROOM.WAVE_01;
        this._currentHp = this._character.hp;

        this._onCharacterHit = this.onCharacterHit.bind(this);
        emitter.on(GameEvents.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
        this._onCalculatePoint = this.onCalculatePoint.bind(this);
        emitter.on(GameEvents.CALCULATE_SCORE, this._onCalculatePoint);
    }

    protected onDestroy(): void {
        emitter.off(GameEvents.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
        emitter.off(GameEvents.CALCULATE_SCORE, this._onCalculatePoint);
    }

    onCalculatePoint(data: any) {
        this._totalEnemy--;
        this._currentScore += data.score;
        this.score.string = `${this._currentScore}`;
    }

    createWave() {
        if (this._isWave === false) {
            this._isWave = true;
            this.schedule(() => {
                this._enemyManager.spawn(this._character.node.worldPosition);
            }, 5, 10);
            this._totalEnemy += 9;
        }
    }

    protected update(dt: number): void {
        this._win();
        if (this._currentHp <= 0) {
            return;
        }
        this.maxTime -= dt / 2;
        this.time.string = Math.max(0, Math.floor(this.maxTime)).toString();
        this.createWave();
    }

    onCharacterHit(data: any) {
        this._updateProgressBar(data.damage);
        if (this.progressBar.progress <= 0) {
            this._character.death();
            this._lose();
        }
    }

    onQuit() {
        this.node.destroy();
        this.node = null;
    }

    private _updateProgressBar(damge: number) {
        this._currentHp = Math.max(this._currentHp - damge, 0);
        this.progressBar.progress = this._currentHp / this._character.hp;
    }

    private _enableButton(isEnable: boolean = true) {
        const pauseButton = this.node.getChildByName("PauseButton").getComponent(Button);
        if (isEnable) {
            pauseButton.onEnable();
        } else {
            pauseButton.onDisable();
        }
    }

    private _lose() {
        emitter.off(GameEvents.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
        emitter.off(GameEvents.CALCULATE_SCORE, this._onCalculatePoint);

        this._enableButton(false);
        this._popUp.showLose(this._currentScore.toString());
    }

    private _win() {
        if (this._totalEnemy < 0 || this.maxTime <= 0) {
            emitter.off(GameEvents.PLAYER_TAKE_DAMAGE, this._onCharacterHit);
            emitter.off(GameEvents.CALCULATE_SCORE, this._onCalculatePoint);
            this._enableButton(false);
            this._popUp.showWin(this._currentScore.toString());
        }
    }
}


