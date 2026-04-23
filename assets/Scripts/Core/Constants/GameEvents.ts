export const GameEvents = {
    BUTTON_PLAY: 'BUTTON:PLAY',

    LOBBY_START: 'LOBBY:START',

    SCREEN_ROOM_PLAY: 'SCREEN:ROOM:PLAY',

    ROOM_ID: 'ROOM:ID',
    ROOM_QUIT: 'ROOM:QUIT',


    POPUP_SETTING_PLAY: 'POPUP:SETTING:PLAY',
    POPUP_PAUSE_PLAY: 'POPUP:PAUSE:PLAY',
    POPUP_CLOSE: 'POPUP:CLOSE'
}

export type Events = {
    [GameEvents.LOBBY_START]: void,
    [GameEvents.BUTTON_PLAY]: void,
    [GameEvents.SCREEN_ROOM_PLAY]: string,
    [GameEvents.POPUP_SETTING_PLAY]: string,
    [GameEvents.POPUP_PAUSE_PLAY]: string,
    [GameEvents.POPUP_CLOSE]: string,
    [GameEvents.ROOM_ID]: string[],
    [GameEvents.ROOM_QUIT]: void,
}

