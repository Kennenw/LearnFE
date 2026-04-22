import mitt from 'mitt';
import { GameEvents } from '../Constants/GameEvents';

class Emitter {
    private emitter = mitt<GameEvents>();

    on = this.emitter.on.bind(this.emitter);
    off = this.emitter.off.bind(this.emitter);
    emit = this.emitter.emit.bind(this.emitter);
}

export const emitter = new Emitter();

