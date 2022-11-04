import { getIsFlashingBrowser } from '../../checkout';

export interface IStyle {
  readonly isFlashingBrowser: boolean;

  readonly guid: string;

  addStyle(style: string): void;
  attach(): IStyle;
  remove(): IStyle;

  disableBodyScroll(): void;
  enableBodyScroll(): void;
}

export class Style implements IStyle {
  private readonly styleElement: HTMLStyleElement;

  private readonly bodyScrollDisableClassName: string;

  readonly isFlashingBrowser: boolean;

  constructor(public readonly guid: string) {
    this.styleElement = document.createElement('style');
    this.styleElement.textContent += this.getBasicStyle();
    this.bodyScrollDisableClassName = `is-fs-checkout-open-${this.guid}`;

    this.isFlashingBrowser = getIsFlashingBrowser();
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
    document.body.classList.add(this.bodyScrollDisableClassName);
  }

  public enableBodyScroll() {
    document.body.classList.remove(this.bodyScrollDisableClassName);
  }

  private getBasicStyle(): string {
    return `body.${this.bodyScrollDisableClassName} {
			overflow: hidden;
		}`;
  }
}
