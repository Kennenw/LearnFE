import { _decorator, Component } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GameEvents } from '../Core/Constants/GameEvents';
import { PopUp } from '../Core/Constants/PopUp';
import { FreezeNode } from '../Utils/FreezeNode';
const { ccclass } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {

    onClickSetting() {
        FreezeNode.pauseGame();
        emitter.emit(GameEvents.POPUP_SETTING_PLAY, PopUp.SETTING);
    }

    onClickCloseSetting() {
        emitter.emit(GameEvents.POPUP_SETTING_CLOSE);
    }

    onClickPlay() {
        emitter.emit(GameEvents.BUTTON_PLAY);
    }

    onClickPause() {
        FreezeNode.pauseGame();
        emitter.emit(GameEvents.POPUP_PAUSE_PLAY, PopUp.PAUSE);
    }

    onClickClosePause() {
        emitter.emit(GameEvents.POPUP_PAUSE_CLOSE);
    }

    onClickQuit() {
        emitter.emit(GameEvents.ROOM_QUIT, PopUp.PAUSE);
    }
}

