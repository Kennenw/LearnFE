import { _decorator, Component, EventTouch } from 'cc';
import { emitter } from '../Core/Events/Emitter';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
import { AudioManager } from '../Managers/AudioManager';
const { ccclass } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {

    onClickSetting() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.SETTING_PLAY);
    }

    onClickCloseSetting() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.SETTING_CLOSE);
    }

    onClickPlay() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.BUTTON_PLAY);
    }

    onClickPause() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.PAUSE_PLAY);
    }

    onClickClosePause() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.PAUSE_CLOSE);
    }

    onClickQuit() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.ROOM_QUIT);
    }

    onClickReset() {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.ROOM_RESET);
    }

    onChooseBullet(event: EventTouch) {
        AudioManager.instance.playSfx();
        emitter.emit(GAME_EVENTS.CHOOSE_BULLET, { type: event.target.name });
    }
}

