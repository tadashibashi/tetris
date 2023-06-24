import {Keyboard} from "./Keyboard";
import {AudioEngine} from "./WebAA";

export interface GameConfig {
    // Default =
    tickSpeed: number;

}

const defaultConfig: GameConfig = {
   tickSpeed: 33.34,
} ;

export abstract class Game {
    // Perhaps adjust this depending on if mobile or less performant browser
    // (Everything should be calculated via deltaTime in update)
    private mTickSpeed: number;
    private mIsRunning: boolean;
    private mInterval: number;
    private mLastTicks: number;

    private mKeyboard: Keyboard;
    private mAudio: AudioEngine;

    public get keyboard() { return this.mKeyboard; }
    public get audio() { return this.mAudio; }

    protected constructor(config: Partial<GameConfig> = defaultConfig) {
        this.mTickSpeed = config.tickSpeed ?? defaultConfig.tickSpeed;

        this.mKeyboard = new Keyboard;
        this.mAudio = new AudioEngine;
    }

    quit() {
        this.mIsRunning = false;
    }

    get isRunning() { return this.mIsRunning; }

    run() {
        this.mIsRunning = this.initialize();
        this.mLastTicks = performance.now();

        this.render(); // first render pass to show what was initialized

        this.mInterval = setInterval(() => this.runOneFrame(),
            this.mTickSpeed);
    }

    private runOneFrame() {
        if (!this.isRunning) {
            clearInterval(this.mInterval);
            return;
        }
        const currentTicks = performance.now();
        const deltaTime = currentTicks - this.mLastTicks;

        this.processInput();
        this.update(deltaTime);
        this.render();
        this.keyboard.update(deltaTime);
        this.mLastTicks = currentTicks;
    }

    protected abstract initialize(): boolean;
    protected processInput() {

    };

    /**
     * Update game logic, to be overridden by child class.
     * @param deltaTime time passed since last frame in ms.
     * @protected
     */
    protected abstract update(deltaTime: number): void;
    protected abstract render(): void;
}