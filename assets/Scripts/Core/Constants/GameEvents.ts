import { Node, Vec3 } from "cc"
import { CharacterController } from "../../Controllers/CharacterController"

export const GameEvents = {
    SPAWN_CHARACTER: 'SPAWN:CHARACTER',
    CHANGED_CHARACTER: 'CHANGED:CHARACTER',

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
}

export type Events = {
    [GameEvents.SPAWN_CHARACTER]: string,
    [GameEvents.SPAWN_CHARACTER]: CharacterController,
    [GameEvents.SHOOT]: { bulletType: string, direction: number, position: Vec3 },

    [GameEvents.ENEMY_TAKE_DAMAGE]: { damage: number, target: Node },
    [GameEvents.PLAYER_TAKE_DAMAGE]: { damage: number },

    [GameEvents.BUTTON_PLAY]: void,
    [GameEvents.CALCULATE_SCORE]: { score: number },

    [GameEvents.SETTING_PLAY]: void,
    [GameEvents.PAUSE_PLAY]: void,
    [GameEvents.SETTING_CLOSE]: void,
    [GameEvents.PAUSE_CLOSE]: void,

    [GameEvents.ROOM_PLAY]: string,
    [GameEvents.ROOM_QUIT]: void,
    [GameEvents.ROOM_RESET]: void,
}

