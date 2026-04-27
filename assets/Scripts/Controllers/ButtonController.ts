import { _decorator, Component } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { AudioManager } from '../Managers/AudioManager';
const { ccclass } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {

    onClickSetting() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.SETTING_PLAY);
    }

    onClickCloseSetting() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.SETTING_CLOSE);
    }

    onClickPlay() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.BUTTON_PLAY);
    }

    onClickPause() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.PAUSE_PLAY);
    }

    onClickClosePause() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.PAUSE_CLOSE);
    }

    onClickQuit() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.ROOM_QUIT);
    }

    onClickReset() {
        AudioManager.instance.playSfx();
        emitter.emit(GameEvents.ROOM_RESET);
    }
}

