import { CheckoutPopupOptions } from './contracts/CheckoutPopupOptions';

export interface CheckoutOptions extends CheckoutPopupOptions {
    /**
     * The URL of the image to display while the checkout is loading. By default a loading indicator from Freemius will be used.
     */
    loadingImageUrl?: string;
    /**
     * The alt text for the loading image. By default 'Loading Freemius Checkout' will be used.
     */
    loadingImageAlt?: string;
}
