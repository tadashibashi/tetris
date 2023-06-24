export interface GameConfig {
    // Default =
    tickSpeed: number;

}

const defaultConfig: GameConfig = {
   tickSpeed: 33.34,
} ;

export abstract class Game {
    private mTickSpeed: number;
    private mIsRunning: boolean;

    protected constructor(config: Partial<GameConfig> = defaultConfig) {
        this.mTickSpeed = config.tickSpeed ?? defaultConfig.tickSpeed;

    }

    quit() {
        this.mIsRunning = false;
    }

    get isRunning() { return this.mIsRunning; }

    run() {
        this.mIsRunning = this.initialize();

        while (this.isRunning) {

        }
    }

    protected abstract initialize(): boolean;
    protected abstract processInput(): void;
    protected abstract update(): void;
    protected abstract render(): void;
}