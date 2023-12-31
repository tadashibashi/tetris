/**
 * Checks the value of one key
 */
export interface KeyState {
    code: string;
    lastState: number;
    state: number;
}

export class Keyboard {
    // map of key states, do not handle directly
    private keyMap: Map<string, KeyState>;

    // list of key states, do not handle directly
    private keys: KeyState[];

    // Controls whether to add KeyStates automatically when received
    // Default: true
    autoMode: boolean;

    // Controls whether keydown event listener will allow default key behavior.
    // Default: false, blocks default
    allowDefault: boolean;


    /**
     * @param codes - any key codes to set the Keyboard with
     */
    constructor(...codes: string[]) {
        this.keys = [];
        this.keyMap = new Map;

        if (codes.length)
            this.add(...codes);

        this.autoMode = true;
        this.allowDefault = false;

        this.processKeyup = this.processKeyup.bind(this);
        this.processKeydown = this.processKeydown.bind(this);

        document.addEventListener("keydown", this.processKeydown);
        document.addEventListener("keyup", this.processKeyup);
    }

    /**
     * Call during cleaning up. Removes event listeners from the DOM.
     */
    close() {
        document.removeEventListener("keydown", this.processKeydown);
        document.removeEventListener("keyup", this.processKeyup);
    }

    update(deltaTime: number) {
        this.keys.forEach(key => {
            key.lastState = key.state;
            if (key.state > 0)
                key.state += deltaTime;
        });
    }

    /**
     * Checks if key is down
     * @param code
     */
    isDown(code: string) {
        return this.getState(code).state > 0;
    }

    resetRepeating(code: string) {
        const key = this.getState(code);
        if (key.state > 0) {
            key.state = 0.001;
        }
    }

    isRepeating(code: string, initDelay: number, interval: number) {
        const key = this.getState(code);
        if (key.state >= initDelay + interval) {
            key.state -= interval;
            return true;
        } else {
            return (key.state && !key.lastState);
        }
    }

    isUp(code: string) {
        return !(this.getState(code).state > 0);
    }

    justDown(code: string) {
        const state = this.getState(code);
        return state.state > 0 && state.lastState === 0;
    }

    justUp(code: string) {
        const state = this.getState(code);
        return state.state === 0 && state.lastState > 0;
    }

    private getState(code: string) {
        let state = this.keyMap.get(code);
        if (!state) {
            if (this.autoMode) {
                this.add(code);
                state = this.keyMap.get(code);
            } else {
                throw "Did not have key of value \"" + code + "\" in the Keyboard. " +
                "Did you forget to add it via addKeys?";
            }
        }


        return state;
    }


    /**
     * Add KeyState objects to the Keyboard
     * @param codes - list of codes for each KeyState to add
     */
    add(...codes: string[]) {
        codes.forEach(code => {
            if (this.keyMap.has(code)) return;

            const newKeyState = {
                code,
                lastState: 0,
                state: 0,
            };

            this.keys.push(newKeyState);
            this.keyMap.set(code, newKeyState);
        });
    }

    /**
     * Remove KeyState objects from Keyboard
     * @param codes - list of codes of KeyStates to remove
     */
    remove(...codes: string[]) {
        codes.forEach(code => {
            const keyState = this.keyMap.get(code);
            if (keyState) {
                const idx = this.keys.indexOf(keyState);
                if (idx !== -1)
                    this.keys.splice(idx);
                this.keyMap.delete(code);
            }
        });
    }

    private processKeydown(evt: KeyboardEvent) {
        if (!this.allowDefault)
            evt.preventDefault();

        if (evt.repeat) return;

        let state = this.keyMap.get(evt.code);
        if (!state) {
            if (this.autoMode) {
                this.add(evt.code);
                state = this.keyMap.get(evt.code);
            } else {
                return;
            }
        }

        state.state = 0.001;
    }

    private processKeyup(evt: KeyboardEvent) {
        let state = this.keyMap.get(evt.code);
        if (!state) {
            if (this.autoMode) {
                this.add(evt.code);
                state = this.keyMap.get(evt.code);
            } else {
                return;
            }
        }

        state.state = 0;
    }

}
