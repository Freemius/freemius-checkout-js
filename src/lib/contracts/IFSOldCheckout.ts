import { CheckoutOptions } from '../types';
import { Checkout } from '../checkout';

export interface IFSOldCheckout {
    /**
     * Configure context plugin.
     */
    configure: (options: CheckoutOptions) => Checkout;
    /**
     * Open checkout.
     */
    open: (options: CheckoutOptions) => void;
    /**
     * Close checkout.
     */
    close: () => void;
    /**
     * Resets the existing options.
     */
    clearOptions: () => void;
}
