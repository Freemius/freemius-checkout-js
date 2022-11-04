import { MAX_ZINDEX } from '../../utils/ops';
import { Logger } from '../logger';
import { IStyle } from '../style';

export interface IExitIntent {
  attach(onExit: () => void): IExitIntent;

  isAttached(): boolean;

  detach(): IExitIntent;
}

export class ExitIntent implements IExitIntent {
  private readonly exitIntentId: string;

  private exitIntentDiv: HTMLDivElement | null = null;

  private clearExitIntentListener: (() => void) | null = null;

  constructor(private readonly style: IStyle) {
    this.exitIntentId = `fs-exit-intent-${this.style.guid}`;

    this.style.addStyle(this.getStyle());
  }

  public isAttached(): boolean {
    return null !== this.exitIntentDiv;
  }

  public attach(onExit: () => void): IExitIntent {
    if (this.isAttached()) {
      return this;
    }

    // add the exitIntent Div
    this.exitIntentDiv = document.createElement('div');
    this.exitIntentDiv.id = this.exitIntentId;
    document.body.appendChild(this.exitIntentDiv);

    const html = document.documentElement;
    let delayTimer: number | null = null;
    const delay = 300;

    const mouseLeaveHandler = (event: MouseEvent) => {
      if (!this.isExitAttempt(event)) {
        return;
      }

      delayTimer = setTimeout(() => {
        try {
          onExit();
        } catch (e) {
          Logger.Error(e);
        }
      }, delay);
    };

    const mouseEnterHandler = () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    };

    html.addEventListener('mouseleave', mouseLeaveHandler);
    html.addEventListener('mouseenter', mouseEnterHandler);

    this.clearExitIntentListener = () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
      html.removeEventListener('mouseleave', mouseLeaveHandler);
      html.removeEventListener('mouseenter', mouseEnterHandler);
    };

    return this;
  }

  public detach(): IExitIntent {
    if (!this.isAttached()) {
      return this;
    }

    this.exitIntentDiv?.remove();
    this.exitIntentDiv = null;
    this.clearExitIntentListener?.();

    return this;
  }

  private isExitAttempt(event: MouseEvent) {
    if (event.pageY > 20) {
      return false;
    }

    return true;
  }

  private getStyle(): string {
    return `#${this.exitIntentId} {
			z-index: ${MAX_ZINDEX};
			border: 0;
			background: transparent;
			position: fixed;
			padding: 0;
			margin: 0;
			height: 10px;
			left: 0;
			right: 0;
			width: 100%;
			top: 0;
		}`;
  }
}
