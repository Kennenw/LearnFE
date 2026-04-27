import { _decorator, Component } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { AudioManager } from '../Managers/AudioManager';
const { ccclass } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {

    onClickSetting() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.SETTING_PLAY);
    }

    onClickCloseSetting() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.SETTING_CLOSE);
    }

    onClickPlay() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.BUTTON_PLAY);
    }

    onClickPause() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.PAUSE_PLAY);
    }

    onClickClosePause() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.PAUSE_CLOSE);
    }

    onClickQuit() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.ROOM_QUIT);
    }

    onClickReset() {
        AudioManager.instance.playPfx();
        emitter.emit(GameEvents.ROOM_RESET);
    }
}

