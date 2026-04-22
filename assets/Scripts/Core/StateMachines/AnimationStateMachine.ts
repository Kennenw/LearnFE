import StateMachine from 'javascript-state-machine';
import { CHARACTER_ANIMATION_STATE } from '../Constants/CharacterState';
import { sp } from 'cc';

export class AnimationStateMachine {
    private _state: StateMachine;
    private _spine: sp.Skeleton;

    constructor(spine: sp.Skeleton) {
        this._spine = spine;

        this._state = new StateMachine({
            init: CHARACTER_ANIMATION_STATE.PORTAL,

            transitions: [
                { name: 'idle', from: [CHARACTER_ANIMATION_STATE.IDLE, CHARACTER_ANIMATION_STATE.RUN, CHARACTER_ANIMATION_STATE.PORTAL, CHARACTER_ANIMATION_STATE.SHOOT], to: CHARACTER_ANIMATION_STATE.IDLE },
                { name: 'run', from: [CHARACTER_ANIMATION_STATE.IDLE, CHARACTER_ANIMATION_STATE.SHOOT, CHARACTER_ANIMATION_STATE.RUN], to: CHARACTER_ANIMATION_STATE.RUN },
                { name: 'death', from: '*', to: CHARACTER_ANIMATION_STATE.DEATH },
            ],

            methods: {
                onEnterState: (lifecycle: any) => {
                    this._spine.setCompleteListener(() => {
                        if (this._state.is(CHARACTER_ANIMATION_STATE.PORTAL)) {
                            this.idle();
                        }
                    })
                    this.playAnimation(lifecycle.to);
                }
            }
        });

        this._spine.setMix(CHARACTER_ANIMATION_STATE.RUN, CHARACTER_ANIMATION_STATE.IDLE, 0.4);
        this._spine.setMix(CHARACTER_ANIMATION_STATE.IDLE, CHARACTER_ANIMATION_STATE.RUN, 0.5);

        this._spine.setMix(CHARACTER_ANIMATION_STATE.RUN, CHARACTER_ANIMATION_STATE.DEATH, 0.5);
        this._spine.setMix(CHARACTER_ANIMATION_STATE.IDLE, CHARACTER_ANIMATION_STATE.DEATH, 0.5);
        this._spine.setMix(CHARACTER_ANIMATION_STATE.SHOOT, CHARACTER_ANIMATION_STATE.DEATH, 0.5);
    }

    private playAnimation(state: string) {

        switch (state) {
            case CHARACTER_ANIMATION_STATE.PORTAL:
                this._spine.setAnimation(0, CHARACTER_ANIMATION_STATE.PORTAL, false);
                this._spine.addAnimation(0, CHARACTER_ANIMATION_STATE.IDLE, true);
                break;

            case CHARACTER_ANIMATION_STATE.IDLE:
                this._spine.setAnimation(0, CHARACTER_ANIMATION_STATE.IDLE, true);
                break;

            case CHARACTER_ANIMATION_STATE.RUN:
                this._spine.setAnimation(0, CHARACTER_ANIMATION_STATE.RUN, true);
                break;

            case CHARACTER_ANIMATION_STATE.DEATH:
                this._spine.setAnimation(0, CHARACTER_ANIMATION_STATE.DEATH, false);
                break;
        }
    }

    isLocked(): boolean {
        return this._state.is(CHARACTER_ANIMATION_STATE.PORTAL)
            || this._state.is(CHARACTER_ANIMATION_STATE.DEATH);
    }

    run() {
        if (!this._state.is(CHARACTER_ANIMATION_STATE.RUN)) {
            this._state.run();
        }
    }

    idle() {
        if (!this._state.is(CHARACTER_ANIMATION_STATE.IDLE)) {
            this._state.idle();
        }
    }

    death() {
        if (!this._state.is(CHARACTER_ANIMATION_STATE.DEATH)) {
            this._state.death();
        }
    }
} 