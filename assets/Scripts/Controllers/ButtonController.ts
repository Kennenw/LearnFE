import { _decorator, Component } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
const { ccclass } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {

    onClickSetting() {
        emitter.emit(GameEvents.SETTING_PLAY);
    }

    onClickCloseSetting() {
        emitter.emit(GameEvents.SETTING_CLOSE);
    }

    onClickPlay() {
        emitter.emit(GameEvents.BUTTON_PLAY);
    }

    onClickPause() {
        emitter.emit(GameEvents.PAUSE_PLAY);
    }

    onClickClosePause() {
        emitter.emit(GameEvents.PAUSE_CLOSE);
    }

    onClickQuit() {
        emitter.emit(GameEvents.ROOM_QUIT);
    }

    onClickReset() {
        emitter.emit(GameEvents.ROOM_RESET);
    }
}

