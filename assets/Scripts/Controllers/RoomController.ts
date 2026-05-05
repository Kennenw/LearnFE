import { _decorator, Button, Component, Label, ProgressBar, Node } from 'cc';
import { CharacterManager } from '../Managers/CharacterManager';
import { EnemyManager } from '../Managers/EnemyManager';
import { CharacterController } from './CharacterController';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
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

    @property([Label])
    waves: Label[] = [];

    @property(Label)
    score: Label

    @property(Node)
    wavePopup: Node

    @property(Label)
    totalEnemy: Label

    @property([Node])
    imagePopup: Node[] = [];

    @property([Node])
    buttonBulletTypes: Node[] = [];

    @property(Node)
    backgroundPanelEnemy: Node

    @property(Node)
    backgroundPanelBoss: Node

    private _charactorManager: CharacterManager;
    private _enemyManager: EnemyManager;
    private _character: CharacterController;
    private _onCalculatePoint: (data: any) => void;
    private _currentHp: number;
    private _currentScore: number = 0;
    private _popUp: PopUpManager;
    private _totalEnemy: number = 0;
    private _waveTime: number = 0;
    private _listEnemy: string[] = ['Enemy01', 'Enemy02', 'Enemy03'];
    private _isWave: boolean = false;
    private _onCharacterHP: (data: any) => void;
    private _isWin = false;
    currentWave: string = '';
    private _onButtonBulletType: (data: any) => void;

    init() {
        this._popUp = PopUpManager.instance;
        this._charactorManager = this.node.getComponentInChildren(CharacterManager);
        this._enemyManager = this.node.getComponentInChildren(EnemyManager);
        this._character = this._charactorManager.getMainCharacter();
        this.waves.forEach((wave) => {
            wave.string = WAVE_ROOM.WAVE_01;
        });
        this.totalEnemy.string = `${this.totalEnemy}`;
        this.score.string = `SCORE:  ${this._currentScore}`;
        this.currentWave = WAVE_ROOM.WAVE_01;

        this._onCharacterHP = this.onCharacterHP.bind(this);
        emitter.on(GAME_EVENTS.CALCULATE_HP_PLAYER, this._onCharacterHP);
        this._onCalculatePoint = this.onCalculatePoint.bind(this);
        emitter.on(GAME_EVENTS.CALCULATE_SCORE, this._onCalculatePoint);
        this._onButtonBulletType = this.onButtonBulletType.bind(this);
        emitter.on(GAME_EVENTS.CHOOSE_BULLET, this._onButtonBulletType);
        emitter.on(GAME_EVENTS.HEAL_CHARACTER, this._onCharacterHP);
    }

    protected start(): void {
        this._createWave(2, 60, 1, WAVE_ROOM.WAVE_01);
    }

    protected update(dt: number): void {
        if (this._isWin) {
            return;
        }

        this.totalEnemy.string = `${this._totalEnemy}`
        if (this._currentHp <= 0) {
            return;
        }

        this._waveTime -= dt / 2;
        this.time.string = Math.max(0, Math.floor(this._waveTime)).toString();

        if (this._waveTime <= 0) {
            this._waveTime = 0;
            this._lose();
            return;
        }

        if (!this._isWave && this._totalEnemy <= 0) {

            if (this.currentWave === WAVE_ROOM.WAVE_01) {
                this._createWave(5, 80, 2, WAVE_ROOM.WAVE_02);
                return;
            }

            if (this.currentWave === WAVE_ROOM.WAVE_02) {
                this._bossWave(15, 180, WAVE_ROOM.WAVE_BOSS);
                return;
            }

            if (this.currentWave === WAVE_ROOM.WAVE_BOSS) {
                this._win();
                return;
            }
        }
    }

    onCalculatePoint(data: any) {
        this._totalEnemy--;
        this._currentScore += data.score;
        this.score.string = `SCORE:  ${this._currentScore}`;
    }

    onCharacterHP(data: any) {
        this._updateProgressBar(data.currentHP, data.maxHP);
        if (this.progressBar.progress <= 0) {
            this._character.death();
            this.scheduleOnce(() => {
                this._lose();
            }, 3)
        }
    }

    onQuit() {
        this.node.destroy();
    }
    
    private onButtonBulletType(data: any) {
        this.buttonBulletTypes.forEach((button) => {
            if (button.name === data.type) {
                button.setScale(0.8, 0.8);
            } else {
                button.setScale(1, 1);
            }
        })
    }

    private _createWave(totalEnemy: number, totalTime: number, wave: number, wavelabel: string) {
        this._waveTime += totalTime;
        this.currentWave = wavelabel;
        let count = 0;
        this._isWave = true;
        this.waves.forEach(wave => {
            wave.string = wavelabel;
        });

        this.scheduleOnce(() => {
            this.backgroundPanelEnemy.active = true;
            this.imagePopup.forEach((image) => {
                image.active = image.name === this._listEnemy[wave - 1];
                if (image.active) {
                    this.wavePopup.active = true;
                }
            })
        }, 1);

        this.scheduleOnce(() => {
            this.wavePopup.active = false;

            this.imagePopup.forEach((image) => {
                image.active = false;
            });

        }, 4);

        const spawnFunction = () => {
            this._enemyManager.spawn(
                this._character.node.worldPosition,
                this._randomEnemy(wave),
                this._character.node
            );

            this._totalEnemy++;
            count++;

            if (count >= totalEnemy) {
                this.unschedule(spawnFunction);
                this._isWave = false;
            }
        };
        this.schedule(spawnFunction, 2, totalEnemy - 1, 3);
    }

    private _bossWave(totalEnemy: number, totalTime: number, wavelabel: string) {
        this._waveTime += totalTime;
        let count = 0;
        this.currentWave = wavelabel;
        this._isWave = true;
        this.waves.forEach(wave => {
            wave.string = wavelabel;
        });

        this.scheduleOnce(() => {
            this.backgroundPanelEnemy.active = false;
            this.backgroundPanelBoss.active = true;
            this.imagePopup.forEach((image) => {
                image.active = image.name === this._listEnemy[2];
                if (image.active) {
                    this.wavePopup.active = true;
                }
            })
        }, 1);

        this.scheduleOnce(() => {
            this.wavePopup.active = false;
            this.imagePopup.forEach((image) => {
                image.active = false;
            });
            this._enemyManager.spawn(
                this._character.node.worldPosition,
                this._listEnemy[2],
                this._character.node);
            this._totalEnemy++;
        }, 4);

        const spawnFunction = () => {
            this._enemyManager.spawn(
                this._character.node.worldPosition,
                this._randomEnemy(2),
                this._character.node
            );

            this._totalEnemy++;
            count++;

            if (count >= totalEnemy) {
                this.unschedule(spawnFunction);
                this._isWave = false;
            }
        };

        this.schedule(spawnFunction, 1, totalEnemy - 1, 1);
    }

    private _updateProgressBar(currentHP: number, maxHP: number) {
        this.progressBar.progress = currentHP / maxHP;
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
        emitter.off(GAME_EVENTS.CALCULATE_HP_PLAYER, this._onCharacterHP);
        emitter.off(GAME_EVENTS.CALCULATE_SCORE, this._onCalculatePoint);

        this._enableButton(false);
        this._popUp.showLose(this._currentScore.toString());
    }

    private _win() {
        if (this._totalEnemy <= 0 && !this._isWave) {
            emitter.off(GAME_EVENTS.CALCULATE_HP_PLAYER, this._onCharacterHP);
            emitter.off(GAME_EVENTS.CALCULATE_SCORE, this._onCalculatePoint);
            this._enableButton(false);
            this._popUp.showWin(this._currentScore, Math.floor(this._waveTime));
            this._isWin = true;
        }
    }

    private _randomEnemy(types: number): string {
        const enemy = Math.floor(Math.random() * types);
        return this._listEnemy[enemy];
    }

    protected onDestroy(): void {
        emitter.off(GAME_EVENTS.CALCULATE_SCORE, this._onCalculatePoint);
        emitter.off(GAME_EVENTS.CHOOSE_BULLET, this._onButtonBulletType);
        emitter.off(GAME_EVENTS.HEAL_CHARACTER, this._onCharacterHP);
        emitter.off(GAME_EVENTS.CALCULATE_HP_PLAYER, this._onCharacterHP);
    }
}


