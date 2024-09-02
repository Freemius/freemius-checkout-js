import { CheckoutPopupOptions } from './contracts/CheckoutPopupOptions';

export interface CheckoutOptions extends CheckoutPopupOptions {
    loadingImageUrl?: string;
    loadingImageAlt?: string;
}
