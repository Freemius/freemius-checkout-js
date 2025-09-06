import { generateGuid, isSsr } from './utils/ops';
import { Logger } from './services/logger';
import type { PostmanEvents } from './services/postman';
import type { CheckoutOptions } from './types';
import { Style } from './services/style';
import { Loader } from './services/loader';
import { CheckoutPopup } from './services/checkout-popup';
import {
    CheckoutPopupArbitraryParams,
    CheckoutPopupOptions,
} from './contracts/CheckoutPopupOptions';
import { ExitIntent } from './services/exit-intent';
import { ILoader } from './contracts/ILoader';
import { IExitIntent } from './contracts/IExitIntent';
import { IStyle } from './contracts/IStyle';
import { Cart } from './services/cart';
export type { PostmanEvents, CheckoutOptions };

const CHECKOUT_URL_PRODUCTION = 'https://checkout.freemius.com';
const CHECKOUT_URL_TEST = 'http://checkout.freemius-local.com:8080';

export class Checkout {
    private readonly options: CheckoutPopupOptions &
        CheckoutPopupArbitraryParams = {
        plugin_id: 0,
        public_key: '',
    };

    private readonly guid: string;

    private readonly baseUrl: string;

    public readonly style?: IStyle;

    private readonly loader?: ILoader;

    private readonly checkoutPopup?: CheckoutPopup;

    private readonly exitIntent?: IExitIntent;

    public readonly cart?: Cart;

    constructor(
        options: CheckoutOptions,
        recoverCart: boolean = true,
        baseUrl: string | null = null
    ) {
        this.baseUrl = baseUrl ?? CHECKOUT_URL_PRODUCTION;

        const { plugin_id, product_id, public_key, ...popupOptions } = options;

        if (!plugin_id && !product_id) {
            throw new Error('Must provide a product_id to options.');
        }

        this.options = {
            ...popupOptions,
            public_key,
            plugin_id: product_id ?? plugin_id,
        };

        this.guid = generateGuid();

        if (isSsr()) {
            return;
        }

        // Override baseUrl from the window object if available.
        this.baseUrl =
            baseUrl ??
            (window.FS?.__FS__IS_TEST__
                ? CHECKOUT_URL_TEST
                : CHECKOUT_URL_PRODUCTION);

        this.style = new Style(this.guid);

        this.loader = new Loader(
            this.style,
            options.loadingImageUrl ?? `${this.baseUrl}/assets/img/spinner.svg`,
            options.loadingImageAlt
        );

        this.exitIntent = new ExitIntent(this.style);

        this.checkoutPopup = new CheckoutPopup(
            this.style,
            this.exitIntent,
            this.loader,
            this.baseUrl,
            this.options
        );

        this.cart = new Cart(new URL(window.location.href));

        if (recoverCart) {
            this.recoverCart();
        }
    }

    /**
     * Open the Checkout Popup. You can pass additional options to the function
     * and it will override the previously set options.
     *
     * @todo - Return a promise that will resolve if the purchase is completed and reject if was closed without making a purchase.
     */
    public open(
        options?: Partial<Omit<CheckoutPopupOptions, 'plugin_id'>> &
            CheckoutPopupArbitraryParams
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
        this.checkoutPopup?.open(this.withAffiliateParam(options));
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
            this.open(this.withAffiliateParam(checkoutOptions));
        }
    }

    /**
     * Returns affiliate token from window.FS.Affiliate, if available.
     */
    private getAffiliateToken(): string | null {
        try {
            const FS: any = (window as any).FS;
            if (
                FS &&
                FS.Affiliate &&
                typeof FS.Affiliate.getToken === 'function'
            ) {
                return FS.Affiliate.getToken();
            }
        } catch (e) {}
        return null;
    }

    /**
     * Merge `_fs_affiliate` into options passed to CheckoutPopup.open, unless already present.
     */
    private withAffiliateParam(
        options?: Partial<Omit<CheckoutPopupOptions, 'plugin_id'>> &
            CheckoutPopupArbitraryParams
    ) {
        const token = this.getAffiliateToken();
        if (!token) return options;

        const out: any = { ...(options || {}) };
        if (
            typeof out._fs_affiliate === 'undefined' ||
            out._fs_affiliate === null ||
            out._fs_affiliate === ''
        ) {
            out._fs_affiliate = token;
        }
        return out as typeof options;
    }
}
