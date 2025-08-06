import { CheckoutPopupOptions } from '../../../lib/module/src';

/**
 * Max value of z-index CSS property.
 *
 * @link http://stackoverflow.com/questions/8565821/css-max-z-index-value
 */
export const MAX_ZINDEX = 2147483647;

/**
 * Generates a random GUID. It has the original implementation of the legacy Freemius Checkout for backward compatibility.
 */
export function generateGuid() {
    const _s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    return (
        _s4() +
        _s4() +
        '-' +
        _s4() +
        '-' +
        _s4() +
        '-' +
        _s4() +
        '-' +
        _s4() +
        _s4() +
        _s4()
    );
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

export function isQueryItemInvalid(item: any): boolean {
    return (
        typeof item === 'undefined' ||
        typeof item === 'function' ||
        (typeof item === 'object' && item !== null)
    );
}

export function getQueryValueFromItem(item: any): string | null {
    if (isQueryItemInvalid(item)) {
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

export function convertCheckoutOptionsToQueryParams(
    options: CheckoutPopupOptions
): Record<string, string> {
    const queryParams: Record<string, string> = {};

    Object.entries(options).forEach(([key, value]) => {
        if (!isQueryItemInvalid(value)) {
            queryParams[key] = value;
        }
    });

    const { sandbox } = options;

    if (sandbox && sandbox.ctx && sandbox.token) {
        queryParams.s_ctx_ts = sandbox.ctx;
        queryParams.sandbox = sandbox.token;
    }

    return queryParams;
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

export function getBoolFromQueryParam(paramValue: string | null): boolean {
    if (paramValue === null) {
        return false;
    }

    const normalizedValue = paramValue.toLowerCase();

    return normalizedValue === '1' || normalizedValue === 'true';
}
