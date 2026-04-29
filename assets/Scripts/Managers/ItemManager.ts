import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Item } from '../Entities/Item';
import { emitter } from '../Core/Events/Emitter';
import { GAME_EVENTS } from '../Core/Constants/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('ItemManager')
export class ItemManager extends Component {
    @property([Prefab])
    prefabs: Prefab[] = [];

    private _prefab: Map<string, Prefab> = new Map();
    private _items: Map<string, Item> = new Map();
    private _onPickUp: (data: any) => void;


    private _onSpawn: (data: any) => void;

    protected onLoad(): void {
        this.prefabs.forEach(prefab => {
            this._prefab.set(prefab.name, prefab);
        })
        this._onSpawn = this.randomSpawn.bind(this);
        emitter.on(GAME_EVENTS.DROPPED_ITEM, this._onSpawn);
        this._onPickUp = this._picked.bind(this);
        emitter.on(GAME_EVENTS.PICK_ITEM, this._onPickUp);
    }

    protected onDestroy(): void {
        emitter.off(GAME_EVENTS.DROPPED_ITEM, this._onSpawn);
        emitter.off(GAME_EVENTS.PICK_ITEM, this._onPickUp);
    }

    private randomSpawn(data: any) {
        const percent = Math.floor(Math.random() * 100);
        if (percent <= 10) {
            this._randomItems(data.position);
        }
        return;
    }

    private _randomItems(worldPosition: Vec3) {
        const listItems: string[] = [...this._prefab.keys()];
        const item = Math.floor(Math.random() * listItems.length);
        this._spawn(listItems[item], worldPosition);
    }

    private _spawn(name: string, worldPosition: Vec3) {
        const prefab = this._prefab.get(name);
        const node = instantiate(prefab);
        node.parent = this.node;
        node.setWorldPosition(new Vec3(worldPosition));
        const item = node.getComponent(Item);
        this._items.set(node.uuid, item);
    }

    private _picked(data: any) {
        const target = this._items.get(data.id);
        target.node.destroy();
    }
}

