import {
    CheckoutPopupArbitraryParams,
    CheckoutPopupOptions,
} from './contracts/CheckoutPopupOptions';

/**
 * All options required and supported by the Freemius Checkout.
 *
 * @see https://freemius.com/help/documentation/selling-with-freemius/freemius-checkout-buy-button/
 *
 * @note The `public_key` and either of `plugin_id` or `product_id` are required.
 */
export type CheckoutOptions = Omit<CheckoutPopupOptions, 'plugin_id'> & {
    /**
     * The URL of the image to display while the checkout is loading. By default a loading indicator from Freemius will be used.
     */
    loadingImageUrl?: string;
    /**
     * The alt text for the loading image. By default 'Loading Freemius Checkout' will be used.
     */
    loadingImageAlt?: string;
} & CheckoutPopupArbitraryParams &
    (
        | {
              /**
               * Required product ID (whether it’s a plugin, theme, add-on, bundle, or SaaS).
               */
              product_id: number | string;
              /**
               * @deprecated Use `product_id` instead.
               */
              plugin_id?: never;
          }
        | {
              /**
               * Required product ID (whether it’s a plugin, theme, add-on, bundle, or SaaS).
               *
               * @deprecated Use `product_id` instead.
               */
              plugin_id: number | string;
              product_id?: never;
          }
    );
