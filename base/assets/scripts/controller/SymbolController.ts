import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolController')
export class SymbolController extends Component {
    @property([SpriteFrame])
    symbolSprites: SpriteFrame[] = [];

    private _sprite: Sprite;

    onLoad() {
        this._sprite = this.node.getComponent(Sprite);
        this.randomizeSymbol();
    }

    setSymbol(symbolIndex?: number, spriteName?: string): void {
        if (symbolIndex >= 0 && symbolIndex < this.symbolSprites.length) {
            this._sprite.spriteFrame = this.symbolSprites[symbolIndex];
        } else if (spriteName) {
            const spriteFrame = this.symbolSprites.find(sprite => sprite.name === spriteName);
            if (spriteFrame) {
                this._sprite.spriteFrame = spriteFrame;
            }
        }
    }

    randomizeSymbol(): void {
        const random = Math.floor(
            Math.random() * this.symbolSprites.length
        );

        this.setSymbol(random);
    }

    getSymbolName(): string {
        return this._sprite.spriteFrame.name;
    }
}

