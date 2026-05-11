import { _decorator, Button, Component, Label, Node } from 'cc';
import { GameEventManager } from './core/GameEventManager';
import * as utils from "./utils/utils";
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class LoadGame extends Component {
    eventManager: GameEventManager = null;

    @property(Label)
    walletLabel: Label = null;

    @property(Label)
    betSizeLabel: Label = null;

    @property(Label)
    totalLabel: Label = null;

    @property(Label)
    jackpotLabel: Label = null;

    @property(Button)
    minusButton: Button = null;

    @property(Button)
    plusButton: Button = null;


    private _onLoadData: (data: any) => void;
    private _onUpdateBet: (data: any) => void;
    private _jackpots: Record<string, number> = {};
    private _betDenoms: Record<number, number> = {};
    private _bets: Record<number, number> = {};
    private _betIds: number[] = [];
    private _jackpotIs: string[] = [];
    private _currentIndex: number = 0;
    private _wallet: number = 0;

    onLoad(): void {
        this.eventManager = this.node.parent.getComponent(GameEventManager);
        this._onLoadData = this.loadData.bind(this);
        this._onUpdateBet = this.updateBet.bind(this);
    }

    onEnable(): void {
        this.eventManager.on("JOIN_GAME_SUCCESS", this._onLoadData);
        this.eventManager.on("MINUS_BUTTON_CLICK", this._onUpdateBet);
        this.eventManager.on("PLUS_BUTTON_CLICK", this._onUpdateBet);
    }

    private loadData(data: any): void {
        this._wallet = data.wallet;
        data.mainBet.split(",").forEach(item => {
            const [betId, totalBet] =
                item.split(";").map(Number);
            this._betDenoms[betId] = totalBet / 25;
            this._bets[betId] = totalBet;
            this._betIds.push(betId);
        });

        Object.keys(data.jackpot).map(key => {
            this._jackpots[key] = +data.jackpot[key];
            this._jackpotIs.push(key);
        });

        this.loadWallet();
        this.loadBet();
        this.loadJackpot();
        this.minusButton.interactable = false;
    }

    private loadWallet(): void {
        utils.tweenMoney(this.walletLabel,
            0.5,
            this._wallet,
            {
                acceptRunDown: true,
            },
            (value) => '$' + utils.formatMoney(value));
    }

    private loadBet(): void {
        const currentBetId = this._betIds[this._currentIndex];
        utils.tweenMoney(this.betSizeLabel,
            0.5,
            this._betDenoms[currentBetId],
            {
                acceptRunDown: true,
            },
            utils.formatMoney);

        utils.tweenMoney(this.totalLabel,
            0.5,
            this._bets[currentBetId],
            {
                acceptRunDown: true,
            },
            utils.formatMoney);
    }

    private loadJackpot(): void {
        utils.tweenMoney(this.jackpotLabel,
            0.5,
            this._jackpots[this._jackpotIs[this._currentIndex]],
            {
                acceptRunDown: true,
            },
            (value) => '$' + utils.formatMoney(value));
    }

    private updateBet(data: any): void {
        if (data.value === 1) {
            this._currentIndex++;
            if (this._currentIndex >= this._betIds.length) {
                this.plusButton.interactable = false;
                return;
            }
        } else {
            this._currentIndex--;
            if (this._currentIndex < 0) {
                this.minusButton.interactable = false;
                return;
            }
        }

        this.minusButton.interactable = this._currentIndex > 0;
        this.plusButton.interactable =
            this._currentIndex < this._betIds.length - 1;

        this.loadBet();
        this.loadJackpot();
    }
}

