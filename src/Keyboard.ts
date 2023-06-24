/**
 * Checks the value of one key
 */
export interface KeyState {
    code: string;
    repeating: boolean;
    lastState: number;
    state: number;
}

export class Keyboard {
    keyMap: Map<string, KeyState>;
    keys: KeyState[];
    autoMode: boolean;

    constructor(...codes: string[]) {
        this.keys = [];
        this.keyMap = new Map;

        if (codes.length)
            this.add(...codes);

        this.autoMode = true;

        this.processKeyup = this.processKeyup.bind(this);
        this.processKeydown = this.processKeydown.bind(this);

        document.addEventListener("keydown", this.processKeydown);
        document.addEventListener("keyup", this.processKeyup);
    }

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

    isDown(code: string) {
        return this.getState(code).state > 0;
    }

    timeDown(code: string) {
        return this.getState(code).state;
    }

    isRepeating(code: string, initDelay: number, interval: number) {
        const key = this.getState(code);
        return ( (key.state && !key.lastState) ||
             (key.state > initDelay &&
            Math.floor(key.state/(interval/2)) % 2 === 0) );
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


    add(...codes: string[]) {
        codes.forEach(code => {
            if (this.keyMap.has(code)) return;

            const newKeyState = {
                code,
                repeating: false,
                lastState: 0,
                state: 0,
            };

            this.keys.push(newKeyState);
            this.keyMap.set(code, newKeyState);
        });
    }

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
