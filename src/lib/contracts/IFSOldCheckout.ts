import { CheckoutOptions } from '../types';

export interface IFSOldCheckout {
    /**
     * Configure context plugin.
     */
    configure: (options: CheckoutOptions, baseUrl?: string) => IFSOldCheckout;
    /**
     * Open checkout.
     */
    open: (options?: Partial<CheckoutOptions>) => void;
    /**
     * Close checkout.
     */
    close: () => void;
    /**
     * Resets the existing options.
     */
    clearOptions: () => void;

    /**
     * Get the guid of the checkout.
     */
    getGuid: () => string;
}
