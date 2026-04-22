import StateMachine from 'javascript-state-machine';
import { ACTIONS, STATE_INPUT } from '../Constants/Input';

export class InputStateMachine {
    private _state: StateMachine;
    private _context: any;

    constructor(context: any) {
        this._context = context;

        this._state = new StateMachine({
            init: STATE_INPUT.IDLE,

            transitions: [
                { name: 'moveLeft', from: '*', to: ACTIONS.MOVE_LEFT },
                { name: 'moveRight', from: '*', to: ACTIONS.MOVE_RIGHT },
                { name: 'moveUp', from: '*', to: ACTIONS.MOVE_UP },
                { name: 'moveDown', from: '*', to: ACTIONS.MOVE_DOWN },
                { name: 'attack', from: '*', to: ACTIONS.ATTACK },
            ],

            methods: {
                onEnterState: (lifecycle: any) => {
                    const state = lifecycle.to;

                    switch (state) {
                        case ACTIONS.MOVE_LEFT:
                            this._context.onMoveLeft();
                            break;

                        case ACTIONS.MOVE_RIGHT:
                            this._context.onMoveRight();
                            break;

                        case ACTIONS.MOVE_UP:
                            this._context.onMoveUp();
                            break;

                        case ACTIONS.MOVE_DOWN:
                            this._context.onMoveDown();
                            break;

                        case ACTIONS.ATTACK:
                            this._context.onMoveAttack();
                            break;
                    }
                }
            }
        });
    }

    left() {
        this._state.moveLeft();
    }

    right() {
        this._state.moveRight();
    }

    up() {
        this._state.moveUp();
    }

    down() {
        this._state.moveDown();
    }

    attack() {
        this._state.attack();
    }
} 