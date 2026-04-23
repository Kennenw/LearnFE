import mitt from 'mitt';
import { Events } from '../Constants/GameEvents';

class Emitter {
    private emitter = mitt<Events>();

    on = this.emitter.on.bind(this.emitter);
    off = this.emitter.off.bind(this.emitter);
    emit = this.emitter.emit.bind(this.emitter);
}

export const emitter = new Emitter();

