import {
    initOptions,
    baseUrl,
    eventListeners,
    resetEventText,
} from '../common';
import type { Checkout } from '../../../src';

/* eslint-disable no-var */
declare var FS: { Checkout: typeof Checkout };

window.addEventListener('load', () => {
    const handler = new FS.Checkout(initOptions, true, baseUrl);

    document.querySelector('#buy')!.addEventListener('click', (e) => {
        e.preventDefault();

        handler.open(eventListeners);
    });

    document.querySelector('#event-reset')!.addEventListener('click', (e) => {
        e.preventDefault();

        resetEventText();
    });
});
