export const Logger = {
    Log(...args: any[]) {
        if (console && console.log) {
            console.log(...args);
        }
    },
    Error(...args: any[]) {
        if (console && console.error) {
            console.error(...args);
        }
    },
    Warn(...args: any[]) {
        if (console && console.warn) {
            console.warn(...args);
        }
    },
    Debug(...args: any[]) {
        if (console && console.debug) {
            console.debug(...args);
        }
    },
};
