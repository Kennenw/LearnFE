import { Node, Vec3 } from "cc"
import { CharacterController } from "../../Controllers/CharacterController"

export const GameEvents = {
    SPAWN_CHARACTER: 'SPAWN:CHARACTER',
    CHANGED_CHARACTER: 'CHANGED:CHARACTER',

    BULLET_HIT: 'BULLET;HIT',
    SHOOT: 'SHOOT',

    BUTTON_PLAY: 'BUTTON:PLAY',

    LOBBY_START: 'LOBBY:START',

    ROOM_PLAY: 'ROOM:PLAY',
    ROOM_ID: 'ROOM:ID',
    ROOM_QUIT: 'ROOM:QUIT',

    POPUP_SETTING_PLAY: 'POPUP:SETTING:PLAY',
    POPUP_SETTING_CLOSE: 'POPUP:SETTING:CLOSE',
    POPUP_PAUSE_PLAY: 'POPUP:PAUSE:PLAY',
    POPUP_PAUSE_CLOSE: 'POPUP:PAUSE:CLOSE',



}

export type Events = {
    [GameEvents.SPAWN_CHARACTER]: string,
    [GameEvents.SPAWN_CHARACTER]: CharacterController,
    [GameEvents.SHOOT]: { bulletType: string, direction: number, position: Vec3 },

    [GameEvents.BULLET_HIT]: { damage: number, target: Node }

    [GameEvents.LOBBY_START]: void,

    [GameEvents.BUTTON_PLAY]: void,

    [GameEvents.POPUP_SETTING_PLAY]: string,
    [GameEvents.POPUP_PAUSE_PLAY]: string,
    [GameEvents.POPUP_SETTING_CLOSE]: void,
    [GameEvents.POPUP_PAUSE_CLOSE]: void,

    [GameEvents.ROOM_PLAY]: string,
    [GameEvents.ROOM_ID]: string[],
    [GameEvents.ROOM_QUIT]: void,
}

