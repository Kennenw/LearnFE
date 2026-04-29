import { Node, Vec3 } from "cc"
import { CharacterController } from "../../Controllers/CharacterController"

export const GAME_EVENTS = {
    SPAWN_CHARACTER: 'SPAWN:CHARACTER',
    CHANGED_CHARACTER: 'CHANGED:CHARACTER',
    CHOOSE_BULLET: 'CHOOSE:BULLET',

    ENEMY_TAKE_DAMAGE: 'ENEMY:TAKE:DAMAGE',
    CALCULATE_SCORE: 'CALCULATE:SCORE',
    SHOOT: 'SHOOT',

    PLAYER_TAKE_DAMAGE: 'PLAYER:TAKE:DAMAGE',

    BUTTON_PLAY: 'BUTTON:PLAY',

    SETTING_PLAY: 'SETTING:PLAY',
    SETTING_CLOSE: 'SETTING:CLOSE',
    PAUSE_PLAY: 'PAUSE:PLAY',
    PAUSE_CLOSE: 'PAUSE:CLOSE',

    ROOM_PLAY: 'ROOM:PLAY',
    ROOM_QUIT: 'ROOM:QUIT',
    ROOM_RESET: 'ROOM:RESET',

    DROPPED_ITEM: 'DROPPER:ITEM',
    PICK_ITEM: 'PICK:ITEM'
}

export type Events = {
    [GAME_EVENTS.SPAWN_CHARACTER]: string,
    [GAME_EVENTS.SPAWN_CHARACTER]: CharacterController,
    [GAME_EVENTS.SHOOT]: { bulletType: string, direction: number, position: Vec3 },

    [GAME_EVENTS.ENEMY_TAKE_DAMAGE]: { damage: number, target: Node, bulletType: string },
    [GAME_EVENTS.PLAYER_TAKE_DAMAGE]: { damage: number },

    [GAME_EVENTS.BUTTON_PLAY]: void,

    [GAME_EVENTS.CHOOSE_BULLET]: { type: string },
    [GAME_EVENTS.CALCULATE_SCORE]: { score: number, isBoss: boolean },

    [GAME_EVENTS.SETTING_PLAY]: void,
    [GAME_EVENTS.PAUSE_PLAY]: void,
    [GAME_EVENTS.SETTING_CLOSE]: void,
    [GAME_EVENTS.PAUSE_CLOSE]: void,

    [GAME_EVENTS.ROOM_PLAY]: string,
    [GAME_EVENTS.ROOM_QUIT]: void,
    [GAME_EVENTS.ROOM_RESET]: void,

    [GAME_EVENTS.DROPPED_ITEM]: { position: Vec3 },
    [GAME_EVENTS.PICK_ITEM]: { id: string, item: Node },
}

