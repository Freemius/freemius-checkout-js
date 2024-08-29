import { CheckoutPopupOptions } from './services/checkout-popup/options';

export interface CheckoutOptions extends CheckoutPopupOptions {
    loadingImageUrl?: string;
    loadingImageAlt?: string;
}
