import { getIsFlashingBrowser } from '../../checkout';
import { isSsr } from '../../utils/ops';

export interface IStyle {
    readonly isFlashingBrowser: boolean;

    readonly guid: string;

    addStyle(style: string): void;
    attach(): IStyle;
    remove(): IStyle;

    disableBodyScroll(): void;
    enableBodyScroll(): void;

    disableMetaColorScheme(): void;
    enableMetaColorScheme(): void;
}

export class Style implements IStyle {
    private readonly styleElement: HTMLStyleElement;

    private readonly bodyScrollDisableClassName: string;

    readonly isFlashingBrowser: boolean;

    private overflow: { x: number; y: number } = { x: 0, y: 0 };

    private metaColorSchemeValue: string | null = null;
    private readonly metaColorSchemeElement: HTMLMetaElement | null = null;

    constructor(public readonly guid: string) {
        this.bodyScrollDisableClassName = `is-fs-checkout-open-${this.guid}`;

        this.styleElement = document.createElement('style');
        this.styleElement.textContent += this.getBasicStyle();

        this.isFlashingBrowser =
            getIsFlashingBrowser() ||
            (!isSsr() && !!document.querySelector('#___gatsby'));

        this.metaColorSchemeElement = document.head.querySelector(
            'meta[name="color-scheme"]'
        );
    }

    addStyle(style: string): void {
        this.styleElement.textContent += style;
    }

    public attach(): Style {
        document.head.appendChild(this.styleElement);

        return this;
    }

    public remove(): Style {
        document.head.removeChild(this.styleElement);

        return this;
    }

    public disableBodyScroll() {
        this.backupScrollPosition();

        document.body.classList.add(this.bodyScrollDisableClassName);
    }

    public enableBodyScroll() {
        document.body.classList.remove(this.bodyScrollDisableClassName);

        this.restoreScrollPosition();
    }

    public disableMetaColorScheme() {
        // Backup the current meta color scheme value.
        if (this.metaColorSchemeElement) {
            this.metaColorSchemeValue =
                this.metaColorSchemeElement.getAttribute('content');

            this.metaColorSchemeElement.setAttribute('content', 'light');
        }
    }

    public enableMetaColorScheme() {
        // Restore the meta color scheme value.
        if (this.metaColorSchemeElement && this.metaColorSchemeValue) {
            this.metaColorSchemeElement.setAttribute(
                'content',
                this.metaColorSchemeValue
            );

            this.metaColorSchemeValue = null;
        }
    }

    private getBasicStyle(): string {
        return `body.${this.bodyScrollDisableClassName} {
			overflow: hidden !important;
		}`;
    }

    private backupScrollPosition() {
        this.overflow = {
            x: document.documentElement.scrollTop,
            y: document.documentElement.scrollLeft,
        };
    }

    private restoreScrollPosition() {
        document.documentElement.scrollTop = this.overflow.x;
        document.documentElement.scrollLeft = this.overflow.y;
    }
}
