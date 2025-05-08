import { CheckoutResponse } from './CheckoutResponse';

/**
 * Supported "locale" option for the checkout.
 *
 * 1. `auto` - The system will try to guess the language of your user by looking into the browser and then the geo-location respectively. However, this won't select languages that are marked as AI-translated or beta for the time being.
 * 2. `auto-beta` - Same as above, but will also select a language marked as beta. When a language marked as beta is selected, the UI will also show a "BETA" tag near it.
 * 3. Full locale code (for eg - `en_US`, `de_DE`, `fr_FR`, etc.)
 *
 * @see https://freemius.com/help/documentation/selling-with-freemius/freemius-checkout-buy-button/
 */
export type CheckoutLocaleValue = 'auto' | 'auto-beta' | string;

export type CheckoutTrackingEvent =
    | 'email-updated'
    | 'exit-intent-promotion-ended'
    | 'licenses-inc'
    | 'licenses-dec'
    | 'billing-cycle-updated'
    | 'currency-changed'
    | 'cooling-off-waiver-toggled'
    | 'coupon-updated'
    | 'complete'
    | 'exit-intent-shown'
    | 'exit-intent-discount-applied'
    | 'exit-intent-canceled'
    | 'paypal-express-checkout'
    | 'paypal'
    | 'cc'
    | 'load'
    | 'review-order';

/**
 * All known parameters for the Checkout iFrame.
 *
 * @internal
 */
export interface CheckoutPopupParams {
    /**
     * Required product ID (whether it's a plugin, theme, add-on, bundle, or SaaS).
     */
    plugin_id: number | string;

    /**
     * Require product public key.
     */
    public_key: string;

    /**
     * An optional ID to set the id attribute of the checkout's <body> HTML element.
     * This argument is particularly useful if you have multiple checkout instances
     * that need to have a slightly different design or visibility of UI components.
     * You can assign a unique ID for each instance and customize it differently
     * using the CSS stylesheet that you can attach through the
     * PLANS -> CUSTOMIZATION in the Developer Dashboard.
     */
    id?: string;

    /**
     *
     * @default "{{ productTitle }} {{ planTitle }}"
     */
    title?: string;

    /**
     * An optional string to override the checkout's subtitle.
     *
     * @default "You're one step closer to our {{ planTitle }} features"
     * @deprecated
     */
    subtitle?: string;

    /**
     * An optional icon that loads at the checkout and will override the product's
     * icon uploaded to the Freemius Dashboard. Use a secure path to the image
     * over HTTPS. While the checkout will remain PCI compliant,
     * credit-card automatic prefill by the browser will not work.
     *
     * @default "product's image set within the Freemius dashboard"
     */
    image?: string;

    /**
     * The ID of the plan that will load with the checkout. When selling multiple
     * plans you can set the param when calling the open() method.
     *
     * @default "1st paid plan"
     */
    plan_id?: number | string;

    /**
     * A multi-site licenses prices that will load immediately with the checkout.
     * A developer-friendly param that can be used instead of the pricing_id.
     * To specify unlimited licenses prices, use one of the following
     * values: 0, null, or 'unlimited'.
     *
     * @default 1
     */
    licenses?: number;

    /**
     * Set this param to true if you like to disable the licenses selector when
     * the product is sold with multiple license activation options.
     *
     * @default false
     */
    disable_licenses_selector?: boolean;

    /**
     * Use the `licenses` param instead. An optional ID of the exact multi-site
     * license prices that will load once the checkout opened.
     *
     * @default "plan's single-site prices ID"
     */
    pricing_id?: number | string;

    /**
     * An optional billing cycle that will be auto selected when the checkout is opened.
     * Can be one of the following values: 'monthly', 'annual', 'lifetime'.
     *
     * @default 'annual'
     */
    billing_cycle?: 'monthly' | 'annual' | 'lifetime';

    /**
     * One of the following 3-chars currency codes (ISO 4217): 'usd', 'eur', 'gbp'.
     *
     * @default 'usd'
     */
    currency?: 'usd' | 'eur' | 'gbp';

    /**
     * An optional coupon code to be automatically applied on the checkout
     * immediately when opened.
     */
    coupon?: string;

    /**
     * Set this param to true if you pre-populate a coupon and like to hide the
     * coupon code and coupon input field from the user.
     *
     * @default false
     */
    hide_coupon?: boolean;

    /**
     * This has been deprecated in favor of bundle_discount introduced in phase2 Checkout.
     *
     * Set this param to false when selling a bundle and you want the discounts
     * to be based on the closest licenses quota and billing cycle from the child
     * products. Unlike the default discounts calculation which is maximized by
     * basing the discounts on the child products single-site prices.
     *
     * @deprecated
     * @default true
     */
    maximize_discounts?: boolean;

    /**
     * When set to true, it will open the checkout in a trial mode and the trial
     * type (free vs. paid) will be based on the plan's configuration. This will
     * only work if you've activated the Free Trial functionality in the plan
     * configuration. If you configured the plan to support a trial that doesn't
     * require a payment method, you can also open the checkout in a trial mode
     * that requires a payment method by setting the value to 'paid'.
     *
     * @default false
     */
    trial?: boolean | 'free' | 'paid';

    /**
     * An optional param to pre-populate a license key for license renewal,
     * license extension and more.
     */
    license_key?: string;

    /**
     * An optional param to load the checkout for a payment method update.
     * When set to `true`, the license_key param must be set and associated with
     * a non-canceled subscription.
     *
     * @default false
     */
    is_payment_method_update?: boolean;

    /**
     * An optional string to prefill the buyer's email address.
     */
    user_email?: string;

    /**
     * An optional string to prefill the buyer's first name.
     */
    user_firstname?: string;

    /**
     * An optional string to prefill the buyer's last name.
     */
    user_lastname?: string;

    /**
     * An optional user ID to associate purchases generated through the checkout
     * with their affiliate account.
     */
    affiliate_user_id?: number;

    /**
     * An optional locale to override the checkout's language.
     */
    language?: CheckoutLocaleValue;

    /**
     * An optional locale to override the checkout's language.
     *
     * @see `language`
     */
    locale?: CheckoutLocaleValue;

    /**
     * An optional token which if present, would pre-populate the checkout with user's personal and billing data (for example, the name, email, country, vat ID etc).
     *
     * @see https://freemius.com/help/documentation/selling-with-freemius/freemius-checkout-buy-button/#user_token_in_checkout_new
     */
    user_token?: string;

    /**
     * Set this parameter to true to make the user details (name and email) readonly. This is useful for SaaS integration where you are loading the user email and their first and last name from your own DB.
     */
    readonly_user?: boolean;

    // SANDBOX
    /**
     * If you would like the dialog to open in sandbox mode,
     */
    sandbox?: {
        ctx: string;
        token: string;
    };

    /**
     * Specify the layout of the form on a larger screen.
     * @default null
     */
    layout?: 'vertical' | 'horizontal' | null;

    /**
     * Specifies the position of the form in horizontal layout.
     * @default 'left'
     */
    form_position?: 'left' | 'right';

    /**
     * If set to true, the Checkout dialog will take the entire screen when opened.
     * @default false
     */
    fullscreen?: boolean;

    /**
     * Whether or not showing the upsell toggles.
     */
    show_upsells?: boolean;

    /**
     * Whether or not showing featured reviews in the checkout.
     */
    show_reviews?: boolean;

    /**
     * When showing the review UI in the checkout, you can specify which review you want to show with its ID.
     */
    review_id?: number;

    /**
     * Whether or not showing Refund Policy UI in the checkout.
     * @default false
     */
    show_refund_badge?: boolean;

    /**
     * Use the parameter to position the refund policy badge when showing the form in horizontal layout.
     * @default 'dynamic'
     */
    refund_policy_position?: 'below_form' | 'below_breakdown' | 'dynamic';

    /**
     * Determines whether the annual discount will be shown in the checkout.
     * @default true
     */
    annual_discount?: boolean;

    /**
     * Switching to the monthly billing cycle is disabled when the Checkout is loaded with annual billing cycle. Use this parameter to show it.
     * @default false
     */
    show_monthly_switch?: boolean;

    /**
     * Determines whether the multi-site discount will be shown.
     * @default 'auto'
     */
    multisite_discount?: true | false | 'auto';

    /**
     * Determines whether the bundle discount will be shown.
     * @default 'maximize'
     */
    bundle_discount?: true | false | 'maximize';

    /**
     * Set it to false to hide the inline currency selector from the "Today's Total" line.
     * @default true
     */
    show_inline_currency_selector?: boolean;

    /**
     * When the checkout is loaded in page you can specify a cancel URL to be used for the back button.
     */
    cancel_url?: string;

    /**
     * If you want to use any other icon image, please specify the link to the icon using this parameter.
     */
    cancel_icon?: string;

    /**
     * When set to true, a small line mentioning the total renewal price per billing cycle will shown below the total.
     * @default false
     */
    always_show_renewals_amount?: boolean;

    /**
     * Determines whether the products in a bundle appear as hidden by default. Is applicable only to bundles.
     * @default true
     */
    is_bundle_collapsed?: boolean;

    /**
     * Set this param to true if you like to entirely hide the 3rd row in the header with the license selector.
     * @default false
     */
    hide_licenses?: boolean;

    /**
     * Default currency to use when 'currency' is set to 'auto'.
     * @default 'usd'
     */
    default_currency?: 'usd' | 'eur' | 'gbp';

    /**
     * Set this parameter to show a billing cycle selector interface in the Checkout. The possible values are:
     *
     * - `responsive_list` – Displays billing cycles in a smart list that adapts to available space.
     * - `dropdown` – Shows a dropdown UI, allowing buyers to select their preferred billing cycle.
     * - `list` – Same as responsive_list but always show up vertically.
     *
     * By default the billing cycle selector does not show up in the UI.
     */
    billing_cycle_selector?: 'list' | 'responsive_list' | 'dropdown';
}

/**
 * All known events for the Checkout iFrame.
 *
 * @internal
 */
export interface CheckoutPopupEvents {
    /**
     * A callback handler that will execute once a user closes the checkout by
     * clicking the close icon. This handler only executes when the checkout is
     * running in a dialog mode.
     */
    cancel?: () => void;
    /**
     * An after successful purchase/subscription completion callback handler.
     *
     * Notice: When the user subscribes to a recurring billing plan, this method
     * will execute upon a successful subscription creation. It doesn't guarantee
     * that the subscription's initial payment was processed successfully as well.
     */
    purchaseCompleted?: (data: CheckoutResponse | null) => void;
    /**
     * An optional callback handler, similar to purchaseCompleted. The main
     * difference is that this callback will only execute after the user clicks
     * the "Got It"" button that appears in the after purchase screen as a
     * declaration that they successfully received the after purchase email.
     * This callback is obsolete when the checkout is running in a 'dashboard' mode.
     */
    success?: (data: CheckoutResponse | null) => void;
    /**
     * An optional callback handler for advanced tracking, which will be called on
     * multiple checkout events such as updates in the currency, billing cycle,
     * licenses #, etc.
     */
    track?: (
        event: CheckoutTrackingEvent | string,
        data: Record<string, any> | null
    ) => void;
    /**
     * Optional callback to execute when the iFrame opens.
     */
    afterOpen?: () => void;
    /**
     * An optional callback to execute when the iFrame closes.
     */
    afterClose?: () => void;
    /**
     * Optional callback to trigger on exit intent. This is called only when the
     * checkout iFrame is shown, not on global exit intent.
     */
    onExitIntent?: () => void;
}

/**
 * All options (parameters and events) required and supported by the Freemius Checkout.
 *
 * @internal
 */
export interface CheckoutPopupOptions
    extends CheckoutPopupParams,
        CheckoutPopupEvents {}

/**
 * Accept any arbitrary key-value pair to be passed to the checkout.
 *
 * @internal
 */
export interface CheckoutPopupArbitraryParams {
    [key: Exclude<string, keyof CheckoutPopupOptions>]: any;
}
