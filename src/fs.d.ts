import { Checkout, postman, Logger } from '.';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';

export {};

declare global {
    interface Window {
        FS: {
            Checkout: typeof Checkout | IFSOldCheckout;
            Logger: typeof Logger;
            postman: typeof postman;
        };
    }
}
