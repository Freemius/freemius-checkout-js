import { generateGuid, isSsr } from './utils/ops';
import { Logger } from './services/logger';
import type { PostmanEvents } from './services/postman';
import type { CheckoutOptions } from './types';
import { Style } from './services/style';
import { Loader } from './services/loader';
import { CheckoutPopup } from './services/checkout-popup';
import { CheckoutPopupOptions } from './contracts/CheckoutPopupOptions';
import { ExitIntent } from './services/exit-intent';
import { ILoader } from './contracts/ILoader';
import { IExitIntent } from './contracts/IExitIntent';
import { IStyle } from './contracts/IStyle';
import { Cart } from './services/cart';
export type { PostmanEvents, CheckoutOptions };

export class Checkout {
    private readonly options: CheckoutOptions = {
        plugin_id: 0,
        public_key: '',
    };

    private readonly guid: string;

    public readonly style?: IStyle;

    private readonly loader?: ILoader;

    private readonly checkoutPopup?: CheckoutPopup;

    private readonly exitIntent?: IExitIntent;

    public readonly cart?: Cart;

    constructor(
        options: CheckoutOptions,
        recoverCart: boolean = true,
        private readonly baseUrl: string = 'https://checkout.freemius.com'
    ) {
        if (!options.plugin_id) {
            throw new Error('Must provide a plugin_id to options.');
        }
        if (!options.public_key) {
            throw new Error('Must provide the public_key to options.');
        }

        this.options = options;
        this.guid = generateGuid();

        if (isSsr()) {
            return;
        }

        this.style = new Style(this.guid);

        this.loader = new Loader(
            this.style,
            this.options.loadingImageUrl ??
                `${this.baseUrl}/assets/img/spinner.svg`,
            this.options.loadingImageAlt
        );

        this.exitIntent = new ExitIntent(this.style);

        this.checkoutPopup = new CheckoutPopup(
            this.style,
            this.exitIntent,
            this.loader,
            this.baseUrl,
            this.options
        );

        this.style.attach();

        this.cart = new Cart(new URL(window.location.href));

        if (recoverCart) {
            this.recoverCart();
        }
    }

    /**
     * Open the Checkout Popup. You can pass additional options to the function
     * and it will override the previously set options.
     */
    public open(
        options?: Partial<
            Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
        >
    ) {
        if (isSsr()) {
            return;
        }

        // if this is already open, then cancel
        if (this.checkoutPopup?.isOpen()) {
            Logger.Warn(
                'Checkout popup already open. Please close it first before opening it again.'
            );
            return;
        }

        // Open the checkout popup.
        this.checkoutPopup?.open(options);
    }

    /**
     * Programmatically close the checkout popup.
     */
    public close() {
        if (isSsr()) {
            return;
        }

        this.checkoutPopup?.close();
    }

    public destroy() {
        if (isSsr()) {
            return;
        }

        this.close();

        // remove style
        this.style?.remove();
    }

    public getGuid() {
        return this.guid;
    }

    private recoverCart() {
        if (
            this.cart?.hasCart() &&
            this.cart?.matchesPluginID(this.options.plugin_id)
        ) {
            const checkoutOptions = this.cart.getCheckoutOptions();
            this.open(checkoutOptions);
        }
    }
}
