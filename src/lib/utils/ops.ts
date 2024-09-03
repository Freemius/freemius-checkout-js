/**
 * Max value of z-index CSS property.
 *
 * @link http://stackoverflow.com/questions/8565821/css-max-z-index-value
 */
export const MAX_ZINDEX = 2147483647;

/**
 * Generate a random UID for use in freemius checkout. This is a simple
 * implementation and is not as robust as nanoid or shortid, but it gets the
 * job done and is very small.
 *
 * @link https://stackoverflow.com/a/6248722/2754557
 *
 * @returns A random UID.
 */
export function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    const firstPart = (Math.random() * 46656) | 0;
    const firstPartStr = `000${firstPart.toString(36)}`.slice(-3);

    const secondPart = (Math.random() * 46656) | 0;
    const secondPartStr = `000${secondPart.toString(36)}`.slice(-3);

    return firstPartStr + secondPartStr;
}

export function getIsFlashingBrowser(): boolean {
    let isFlashingBrowser = false;

    try {
        const ua = navigator.userAgent.toLowerCase();

        if (/edge\/|trident\/|msie /.test(ua)) {
            isFlashingBrowser = true; // IE
        } else if (ua.indexOf('safari') !== -1) {
            if (ua.indexOf('chrome') > -1) {
                // Chrome
            } else {
                isFlashingBrowser = true; // Safari
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // do nothing
    }

    return isFlashingBrowser;
}

export function isQueryItemInValid(item: any): boolean {
    return (
        typeof item === 'undefined' ||
        typeof item === 'function' ||
        (typeof item === 'object' && item !== null)
    );
}

export function getQueryValueFromItem(item: any): string | null {
    if (isQueryItemInValid(item)) {
        return null;
    }

    if (item === null) {
        return 'null';
    }

    if (item === true) {
        return '1';
    }

    if (item === false) {
        return '0';
    }

    return encodeURIComponent(item)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
}

export function buildFreemiusQueryFromOptions(options: Record<string, any>) {
    const query: string[] = [];

    Object.keys(options).forEach((key) => {
        const item = options[key];
        const value = getQueryValueFromItem(item);
        if (value !== null) {
            query.push(`${key}=${value}`);
        }
    });

    return query.join('&');
}

export function isExitAttempt(event: MouseEvent) {
    return event.pageY <= 20;
}

/**
 * Determines whether the current environment is not a browser, rather a server.
 */
export function isSsr(): boolean {
    return typeof window === 'undefined';
}

export function assertNotNull<T>(
    value: T,
    message: string
): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error(message);
    }
}
