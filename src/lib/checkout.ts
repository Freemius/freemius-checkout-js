import { postman } from './services/postman';
import {
  buildFreemiusQueryFromOptions,
  generateUID,
  getIsFlashingBrowser,
  isExitAttempt,
  MAX_ZINDEX,
  isSsr,
} from './utils/ops';
import { Logger } from './services/logger';

export {
  buildFreemiusQueryFromOptions,
  generateUID,
  getIsFlashingBrowser,
  isExitAttempt,
  MAX_ZINDEX,
  Logger,
  postman,
};
import type { PostmanEvents } from './services/postman';
import type { CheckoutOptions } from './types';
import { IStyle, Style } from './services/style';
import { ILoader, Loader } from './services/loader';
import { CheckoutPopup, ICheckoutPopup } from './services/checkout-popup';
import { CheckoutPopupOptions } from './services/checkout-popup/options';
import { ExitIntent, IExitIntent } from './services/exit-intent';
export type { PostmanEvents, CheckoutOptions };

export class FSCheckout {
  private options: CheckoutOptions = { plugin_id: 0, public_key: '' };

  private guid: string;

  private baseUrl: string = 'https://checkout.freemius.com';

  readonly loaderId: string;

  readonly exitIntentId: string;

  readonly iFrameId: string;

  readonly bodyClassOpen: string;

  public style: IStyle;

  private loader: ILoader;

  private checkoupPopup: ICheckoutPopup;

  private exitIntent: IExitIntent;

  constructor(options: CheckoutOptions) {
    if (!options.plugin_id) {
      throw new Error('Must provide a plugin_id to options.');
    }
    if (!options.public_key) {
      throw new Error('Must provide the public_key to options.');
    }

    this.options = options;
    this.guid = generateUID();

    this.loaderId = `fs-loader-${this.guid}`;
    this.bodyClassOpen = `is-fs-checkout-open-${this.guid}`;
    this.exitIntentId = `fs-exit-intent-${this.guid}`;
    this.iFrameId = `fs-checkout-page-${this.guid}`;

    this.style = new Style(this.guid);

    this.loader = new Loader(
      this.style,
      this.options.loadingImageUrl ?? `${this.baseUrl}/assets/img/spinner.svg`,
      this.options.loadingImageAlt
    );

    this.exitIntent = new ExitIntent(this.style);

    this.checkoupPopup = new CheckoutPopup(
      this.style,
      this.exitIntent,
      this.loader,
      this.baseUrl,
      this.options
    );

    if (isSsr()) {
      return;
    }

    this.style.attach();
  }

  /**
   * Open the Checkout Popup. You can pass additional options to the function
   * and it will override the previously set options.
   */
  public open(
    options?: Partial<Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>>
  ) {
    if (isSsr()) {
      return;
    }

    // if this is already open, then cancel
    if (this.checkoupPopup.isOpen()) {
      Logger.Warn(
        'Checkout popup already open. Please close it first before opening it again.'
      );
      return;
    }

    // Open the checkout popup.
    this.checkoupPopup.open(options);
  }

  /**
   * Programmatically close the checkout popup.
   */
  public close() {
    if (isSsr()) {
      return;
    }

    this.checkoupPopup.close();
  }

  public destroy() {
    if (isSsr()) {
      return;
    }

    this.close();

    // remove style
    this.style.remove();
  }

  public getGuid() {
    return this.guid;
  }
}
