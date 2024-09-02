import { CheckoutPopupOptions } from '../../contracts/CheckoutPopupOptions';
import { ILoader } from '../loader';
import { IExitIntent } from '../exit-intent';
import { IStyle } from '../style';
import { CheckoutIFrameBuilder } from './CheckoutIFrameBuilder';
import { CheckoutIFrame } from './CheckoutIFrame';

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
    private checkoutIFrameBuilder: CheckoutIFrameBuilder;

    private checkoutIFrame: CheckoutIFrame | null = null;

    constructor(
        private readonly style: IStyle,
        private readonly exitIntent: IExitIntent,
        private readonly loader: ILoader,
        baseUrl: string,
        options: CheckoutPopupOptions
    ) {
        this.checkoutIFrameBuilder = new CheckoutIFrameBuilder(
            this.style,
            options,
            baseUrl
        );

        this.checkoutIFrameBuilder.addStyle();
    }

    public isOpen(): boolean {
        return this.checkoutIFrame !== null;
    }

    public open(
        overrideOptions?: Partial<
            Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
        >
    ): ICheckoutPopup {
        if (this.isOpen()) {
            return this;
        }

        this.style.disableBodyScroll();
        this.style.disableMetaColorScheme();

        this.loader.show();

        this.exitIntent.attach();

        this.checkoutIFrame =
            this.checkoutIFrameBuilder.create(overrideOptions);

        this.checkoutIFrame.attach(
            this.onLoad.bind(this),
            this.onClose.bind(this)
        );

        this.checkoutIFrame.addToExitIntent(this.exitIntent);

        return this;
    }

    public close(): ICheckoutPopup {
        this.checkoutIFrame?.close();

        return this;
    }

    private onLoad() {
        this.loader.hide();
    }

    private onClose() {
        this.checkoutIFrame = null;

        this.loader.hide();
        this.style.enableBodyScroll();
        this.style.enableMetaColorScheme();
        this.exitIntent.detach();
    }
}
