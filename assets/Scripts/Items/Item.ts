import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    @property
    nameItem: string = '';

    @property 
    value: number = 0;
}

