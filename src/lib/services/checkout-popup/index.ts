import { CheckoutPopupOptions } from '../../contracts/CheckoutPopupOptions';
import { CheckoutIFrameBuilder } from './CheckoutIFrameBuilder';
import { CheckoutIFrame } from './CheckoutIFrame';
import { ILoader } from '../../contracts/ILoader';
import { IExitIntent } from '../../contracts/IExitIntent';
import { IStyle } from '../../contracts/IStyle';

export class CheckoutPopup {
    private checkoutIFrameBuilder: CheckoutIFrameBuilder;

    private checkoutIFrame: CheckoutIFrame | null = null;

    private lastFocusedElement: Element | null = null;

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
    ): CheckoutPopup {
        if (this.isOpen()) {
            return this;
        }

        this.backupFocusedElement();

        this.style.disableBodyScroll();
        this.style.disableMetaColorScheme();

        this.loader.show();

        this.exitIntent.attach();

        this.checkoutIFrame =
            this.checkoutIFrameBuilder.create(overrideOptions);

        this.checkoutIFrame.onLoaded(this.onLoaded.bind(this));
        this.checkoutIFrame.onClosed(this.onClosed.bind(this));

        this.checkoutIFrame.addToExitIntent(this.exitIntent);

        return this;
    }

    public close(): CheckoutPopup {
        this.checkoutIFrame?.close();
        this.loader.hideImmediate();

        return this;
    }

    private onLoaded() {
        this.loader.hide();
    }

    private onClosed() {
        this.checkoutIFrame = null;

        this.loader.hide();
        this.style.enableBodyScroll();
        this.style.enableMetaColorScheme();
        this.exitIntent.detach();
        this.restoreFocusedElement();
    }

    private backupFocusedElement() {
        this.lastFocusedElement = document.activeElement ?? null;
    }

    private restoreFocusedElement() {
        if (this.lastFocusedElement) {
            (this.lastFocusedElement as HTMLElement).focus?.();
            this.lastFocusedElement = null;
        }
    }
}
