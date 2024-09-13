import type { IFSOldCheckout } from '../../../src/lib/contracts/IFSOldCheckout';
import {
    initOptions,
    baseUrl,
    eventListeners,
    resetEventText,
} from '../common';

/* eslint-disable no-var */
declare var FS: { Checkout: IFSOldCheckout };

window.addEventListener('load', () => {
    const handler = FS.Checkout.configure(initOptions, baseUrl);

    document.querySelector('#buy')!.addEventListener('click', (e) => {
        e.preventDefault();

        handler.open(eventListeners);
    });

    document.querySelector('#event-reset')!.addEventListener('click', (e) => {
        e.preventDefault();

        resetEventText();
    });
});
