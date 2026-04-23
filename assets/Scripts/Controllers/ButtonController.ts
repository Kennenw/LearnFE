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

    onClickPlay() {
        emitter.emit(GameEvents.BUTTON_PLAY);
    }

    onClickPause() {
        FreezeNode.pauseGame();
        emitter.emit(GameEvents.POPUP_PAUSE_PLAY, PopUp.PAUSE);
    }

    onClosePopUp(event: Event, customData: string) {
        emitter.emit(GameEvents.POPUP_CLOSE, customData);
    }

    onRoomQuit() {
        emitter.emit(GameEvents.ROOM_QUIT);
    }

}

