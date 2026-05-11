import { _decorator, Component, JsonAsset, warn } from 'cc';
import { GameEventManager } from './GameEventManager';
import { EventConstants } from '../constants/EventConstants';
const { ccclass, property } = _decorator;

@ccclass('DataByBetId')
export class DataByBetId {
    @property({ displayName: 'Bet Id' })
    betId: string = "";

    @property(JsonAsset)
    data: JsonAsset = null;
}

@ccclass('GameDirector')
export class GameDirector extends Component {
    @property({ type: JsonAsset })
    joinGameData: JsonAsset;

    @property({ type: [DataByBetId] })
    dataByBetId: DataByBetId[] = [];

    eventManager: GameEventManager = null;
    private _onSpine: (data: any) => void;

    onLoad(): void {
        this.eventManager = this.node.getComponent(GameEventManager);
        this._onSpine = this.sendSpinRequest.bind(this);
        globalThis.testGame = this;
    }

    onEnable(): void {
        this.eventManager.on(EventConstants.SPIN_START, this._onSpine);
    }

    start(): void {
        this.onJoinGameRequest();
    }

    onJoinGameRequest(): void {
        this.scheduleOnce(() => {
            this.onJoinGameSuccess();
        }, 0.2);
    }

    onJoinGameSuccess(): void {
        const data = this.joinGameData.json;
        warn("%c onJoinGameSuccess ", "color: red", data);
        this.eventManager.emit(EventConstants.JOIN_GAME_SUCCESS, data);
    }

    sendSpinRequest(betId: string): void {
        warn("%c sendSpinRequest ", "color: red", betId);

        this.scheduleOnce(() => {
            const resultData = this.dataByBetId.find(data => data.betId === betId).data.json;
            warn("%c resultData ", "color: red", resultData);
            this.eventManager.emit(EventConstants.SPIN_REQUEST, resultData);
        }, 0.3);
    }

    onDestroy(): void {
        this.eventManager.off(EventConstants.SPIN_START, this._onSpine);
    }
}

