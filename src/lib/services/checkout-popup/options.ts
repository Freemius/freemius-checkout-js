export interface CheckoutPopupOptions {
  //#region URL Query Parameters

  /**
   * Required product ID (whether it’s a plugin, theme, add-on, bundle, or SaaS).
   */
  plugin_id: number | string;
  /**
   * Require product public key.
   */
  public_key: string;
  /**
   * An optional ID to set the id attribute of the checkout’s <body> HTML element.
   * This argument is particularly useful if you have multiple checkout instances
   * that need to have a slightly different design or visibility of UI components.
   * You can assign a unique ID for each instance and customize it differently
   * using the CSS stylesheet that you can attach through the
   * PLANS -> CUSTOMIZATION in the Developer Dashboard.
   */
  id?: string;
  /**
   * An optional string to override the product’s title.
   *
   * @default "Defaults to the product’s title set within the Freemius dashboard."
   */
  name?: string;
  /**
   * An optional string to override the checkout’s title when buying a new license.
   *
   * @default "Great selection, {{ firstName }}!"
   */
  title?: string;
  /**
   * An optional string to override the checkout’s subtitle.
   *
   * @default "You’re one step closer to our {{ planTitle }} features"
   */
  subtitle?: string;
  /**
   * An optional icon that loads at the checkout and will override the product’s
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
   * @default "plan’s single-site prices ID"
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
   * Set this param to `true` if you like to hide the billing cycles selector
   * when the product is sold in multiple billing frequencies.
   *
   * @default false
   */
  hide_billing_cycles?: boolean;
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
   * Set this param to false when selling a bundle and you want the discounts
   * to be based on the closest licenses quota and billing cycle from the child
   * products. Unlike the default discounts calculation which is maximized by
   * basing the discounts on the child products single-site prices.
   *
   * @default true
   */
  maximize_discounts?: boolean;
  /**
   * When set to true, it will open the checkout in a trial mode and the trial
   * type (free vs. paid) will be based on the plan’s configuration. This will
   * only work if you’ve activated the Free Trial functionality in the plan
   * configuration. If you configured the plan to support a trial that doesn’t
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
   * An optional string to prefill the buyer’s email address.
   */
  user_email?: string;
  /**
   * An optional string to prefill the buyer’s first name.
   */
  user_firstname?: string;
  /**
   * An optional string to prefill the buyer’s last name.
   */
  user_lastname?: string;
  /**
   * An optional user ID to associate purchases generated through the checkout
   * with their affiliate account.
   */
  affiliate_user_id?: number;
  // SANDBOX
  /**
   * If you would like the dialog to open in sandbox mode,
   */
  sandbox?: {
    ctx: string;
    token: string;
  };

  //#endregion

  //#region Events

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
   * will execute upon a successful subscription creation. It doesn’t guarantee
   * that the subscription’s initial payment was processed successfully as well.
   */
  purchaseCompleted?: (data: Record<string, any> | null) => void;
  /**
   * An optional callback handler, similar to purchaseCompleted. The main
   * difference is that this callback will only execute after the user clicks
   * the “Got It”” button that appears in the after purchase screen as a
   * declaration that they successfully received the after purchase email.
   * This callback is obsolete when the checkout is running in a 'dashboard' mode
   */
  success?: (
    data: { purchase: Record<string, any> } | Record<string, any> | null
  ) => void;
  /**
   * An optional callback handler for advanced tracking, which will be called on
   * multiple checkout events such as updates in the currency, billing cycle,
   * licenses #, etc.
   */
  track?: (event: string, data: Record<string, any> | null) => void;
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

  //#endregion
}
