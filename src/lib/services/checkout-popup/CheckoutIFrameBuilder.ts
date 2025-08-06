import { CheckoutPopupOptions } from '../../contracts/CheckoutPopupOptions';
import {
    convertCheckoutOptionsToQueryParams,
    MAX_ZINDEX,
} from '../../utils/ops';
import { CheckoutIFrame } from './CheckoutIFrame';
import { IStyle } from '../../contracts/IStyle';

export class CheckoutIFrameBuilder {
    private readonly iFrameID: string;

    static readonly VISIBLE_CLASS: string = 'show';

    constructor(
        private readonly style: IStyle,
        private readonly options: CheckoutPopupOptions,
        private readonly baseUrl: string
    ) {
        this.iFrameID = `fs-checkout-page-${this.style.guid}`;
    }

    public create(
        overrideOptions?: Partial<
            Omit<CheckoutPopupOptions, 'plugin_id' | 'public_key'>
        >
    ) {
        const finalOptions = {
            ...this.options,
            ...overrideOptions,
        };

        return new CheckoutIFrame(
            this.baseUrl,
            this.getQueryParams(finalOptions),
            this.iFrameID,
            CheckoutIFrameBuilder.VISIBLE_CLASS,
            finalOptions
        );
    }

    public addStyle() {
        this.style.addStyle(this.getStyle());
    }

    private getQueryParams(options: CheckoutPopupOptions): Record<string, any> {
        return {
            mode: 'dialog',
            guid: this.style.guid,
            _fs_checkout: true,
            ...convertCheckoutOptionsToQueryParams(options),
        };
    }

    private getStyle(): string {
        return /*@fs-css-minify*/ `#${this.iFrameID} {
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
		#${this.iFrameID}.${CheckoutIFrameBuilder.VISIBLE_CLASS} {
            visibility: visible;
        }
		#${CheckoutIFrame.getWrapperID(this.iFrameID)} {
            z-index: ${MAX_ZINDEX - 1};
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
		`;
    }
}
