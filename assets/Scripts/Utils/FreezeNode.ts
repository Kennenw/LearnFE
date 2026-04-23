import { director } from "cc";

export class FreezeNode {

    static pauseGame() {
        director.pause();
        
    }

    static resumeGame() {
        director.resume();
    }
}