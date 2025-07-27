import { Checkout, postman, Logger } from '.';
import { CheckoutPopupEvents } from '../lib/module/src';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';

export {};

declare global {
    interface Window {
        FS: {
            paymentMethodUpdateEvents?: CheckoutPopupEvents;
            __FS__IS_TEST__?: any;
            Checkout: typeof Checkout | IFSOldCheckout;
            Logger: typeof Logger;
            postman: typeof postman;
        };
    }
}
