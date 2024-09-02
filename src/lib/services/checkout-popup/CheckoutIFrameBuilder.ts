import { CheckoutPopupOptions } from '../../contracts/CheckoutPopupOptions';
import { isQueryItemInValid, MAX_ZINDEX } from '../../utils/ops';
import { CheckoutIFrame } from './CheckoutIFrame';
import { IStyle } from '../../contracts/IStyle';

export class CheckoutIFrameBuilder {
    private readonly iFrameID: string;

    static VISIBLE_CLASS: string = 'show';

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
        const queryParams: Record<string, any> = {
            mode: 'dialog',
            guid: this.style.guid,
            _fs_checkout: true,
        };

        Object.entries(options).forEach(([key, value]) => {
            if (!isQueryItemInValid(value)) {
                queryParams[key] = value;
            }
        });

        const { sandbox } = options;

        if (sandbox && sandbox.ctx && sandbox.token) {
            queryParams.s_ctx_ts = sandbox.ctx;
            queryParams.sandbox = sandbox.token;
        }

        return queryParams;
    }

    private getStyle(): string {
        return `#${this.iFrameID} {
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
		}`;
    }
}
