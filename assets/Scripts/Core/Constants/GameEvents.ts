export const GameEvents = {
    BUTTON_PLAY: 'BUTTON:PLAY',

    LOBBY_START: 'LOBBY:START',

    ROOM_PLAY: 'ROOM:PLAY',
    ROOM_ID: 'ROOM:ID',
    ROOM_QUIT: 'ROOM:QUIT',

    POPUP_SETTING_PLAY: 'POPUP:SETTING:PLAY',
    POPUP_SETTING_CLOSE: 'POPUP:SETTING:CLOSE',
    POPUP_PAUSE_PLAY: 'POPUP:PAUSE:PLAY',
    POPUP_PAUSE_CLOSE: 'POPUP:PAUSE:CLOSE'
}

export type Events = {
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

