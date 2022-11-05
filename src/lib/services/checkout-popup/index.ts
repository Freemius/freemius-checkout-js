import { postman, PostmanEvents } from '../postman';
import { Logger } from '../logger';
import { buildFreemiusQueryFromOptions, MAX_ZINDEX } from '../../utils/ops';
import { CheckoutPopupOptions } from './options';
import { ILoader } from '../loader';
import { IExitIntent } from '../exit-intent';
import { IStyle } from '../style';

export interface ICheckoutPopup {
  open(
    overrideOptions?: Partial<
      Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
    >
  ): ICheckoutPopup;
  isOpen(): boolean;
  close(): ICheckoutPopup;
}

export class CheckoutPopup implements ICheckoutPopup {
  private attachedIFrame: {
    iFrame: HTMLIFrameElement;
    postmanEvent: PostmanEvents | null;
  } | null = null;

  private overflow: { x: number; y: number } = { x: 0, y: 0 };

  private readonly iFrameId: string;

  private readonly guid: string;

  constructor(
    private readonly style: IStyle,
    private readonly exitIntent: IExitIntent,
    private readonly loader: ILoader,
    private readonly baseUrl: string,
    private readonly options: CheckoutPopupOptions
  ) {
    this.guid = this.style.guid;
    this.iFrameId = `fs-checkout-page-${this.style.guid}`;

    this.style.addStyle(this.getStyle());
  }

  public isOpen(): boolean {
    return this.attachedIFrame !== null;
  }

  public open(
    overrideOptions?: Partial<
      Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
    >
  ): ICheckoutPopup {
    this.overflow = {
      x: document.documentElement.scrollTop,
      y: document.documentElement.scrollLeft,
    };

    this.style.disableBodyScroll();
    this.loader.show();

    const iFrame = this.getNewIframe(overrideOptions);
    document.body.appendChild(iFrame);

    const postmanEvent = this.attachPostmanEvents(iFrame, overrideOptions);

    this.attachedIFrame = { iFrame, postmanEvent };

    this.exitIntent.attach(() => {
      postmanEvent?.post('exit_intent', null);
      this.options.onExitIntent?.();
    });

    return this;
  }

  public close(): ICheckoutPopup {
    // Send the close signal to the checkout popup, Freemium might do some things like showing FOMO etc.
    this.attachedIFrame?.postmanEvent?.post('close', null);

    return this;
  }

  private attachPostmanEvents(
    iFrame: HTMLIFrameElement,
    overrideOptions?: Partial<
      Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
    >
  ): PostmanEvents | null {
    const iFramePostman = postman(iFrame, this.baseUrl);

    const { success, purchaseCompleted, cancel, track, afterOpen } = {
      ...this.options,
      ...overrideOptions,
    };

    iFramePostman?.one(
      'upgraded',
      (data) => {
        try {
          success?.(data as any);
        } catch (e) {
          Logger.Error(e);
        }

        this.closeCheckoutPopup(overrideOptions);
      },
      true
    );
    iFramePostman?.one(
      'purchaseCompleted',
      (data) => {
        try {
          purchaseCompleted?.(data as any);
        } catch (e) {
          Logger.Error(e);
        }
      },
      true
    );
    iFramePostman?.one(
      'canceled',
      () => {
        try {
          cancel?.();
        } catch (e) {
          Logger.Error(e);
        }

        this.closeCheckoutPopup(overrideOptions);
      },
      true
    );
    iFramePostman?.on('track', (data) => {
      try {
        track?.((data as any).event, data as any);
      } catch (e) {
        Logger.Error(e);
      }
    });
    iFramePostman?.one(
      'loaded',
      () => {
        // hide the loader
        this.loader.hide();

        iFrame?.classList.add('show');

        // call the afterOpen handler
        try {
          afterOpen?.();
        } catch (e) {
          Logger.Error(e);
        }
      },
      true
    );

    return iFramePostman;
  }

  private closeCheckoutPopup(
    overrideOptions?: Partial<
      Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
    >
  ) {
    // restore document overflow
    document.documentElement.scrollTop = this.overflow.x;
    document.documentElement.scrollLeft = this.overflow.y;

    this.attachedIFrame?.postmanEvent?.destroy();
    this.attachedIFrame?.iFrame.remove();
    this.attachedIFrame = null;

    this.loader.hide();
    this.style.enableBodyScroll();
    this.exitIntent.detach();

    try {
      const { afterClose } = { ...this.options, ...overrideOptions };
      afterClose?.();
    } catch (e) {
      Logger.Error(e);
    }
  }

  private getNewIframe(
    overrideOptions: Partial<
      Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
    > = {}
  ): HTMLIFrameElement {
    const {
      plugin_id,
      public_key,
      affiliate_user_id,
      billing_cycle,
      coupon,
      currency,
      disable_licenses_selector,
      hide_billing_cycles,
      hide_coupon,
      id,
      image,
      is_payment_method_update,
      license_key,
      licenses,
      maximize_discounts,
      name,
      plan_id,
      pricing_id,
      sandbox,
      title,
      trial,
      user_email,
      user_firstname,
      user_lastname,
    } = { ...this.options, ...overrideOptions };

    const queryParams: Record<string, any> = {
      plugin_id,
      public_key,
      affiliate_user_id,
      billing_cycle,
      coupon,
      currency,
      disable_licenses_selector,
      hide_billing_cycles,
      hide_coupon,
      id,
      image,
      is_payment_method_update,
      license_key,
      licenses,
      maximize_discounts,
      name,
      plan_id,
      pricing_id,
      title,
      trial,
      user_email,
      user_firstname,
      user_lastname,
      mode: 'dialog',
      guid: this.guid,
    };

    if (sandbox && sandbox.ctx && sandbox.token) {
      queryParams.s_ctx_ts = sandbox.ctx;
      queryParams.sandbox = sandbox.token;
    }

    // Create the iFrame
    const src = `${this.baseUrl}/?${buildFreemiusQueryFromOptions(
      queryParams
    )}#${encodeURIComponent(document.location.href)}`;

    const iFrame = document.createElement('iframe');
    iFrame.id = this.iFrameId;
    iFrame.setAttribute('allowTransparency', 'true');
    iFrame.src = src;
    iFrame.setAttribute('width', '100%');
    iFrame.setAttribute('height', '100%');
    iFrame.setAttribute(
      'style',
      'background: rgba(0,0,0,0.003); border: 0 none transparent;'
    );
    iFrame.setAttribute('frameborder', '0');

    return iFrame;
  }

  private getStyle(): string {
    return `#${this.iFrameId} {
			z-index: ${MAX_ZINDEX - 1};
			background: rgba(0,0,0,0.003);
			border: 0 none transparent;
			visibility: ${this.style.isFlashingBrowser ? 'hidden' : 'visible'};
			margin: 0;
			padding: 0;
			position: fixed;
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			-webkit-tap-highlight-color: transparent;
			overflow: hidden;
		}
		#${this.iFrameId}.show {
			visibility: visible;
		}`;
  }
}
