import { MAX_ZINDEX } from '../../utils/ops';
import { Logger } from '../logger';
import { isExitAttempt } from '../../utils/ops';
import { ExitIntentListener, IExitIntent } from '../../contracts/IExitIntent';
import { IStyle } from '../../contracts/IStyle';

export class ExitIntent implements IExitIntent {
    private readonly exitIntentId: string;

    private exitIntentDiv: HTMLDivElement | null = null;

    private clearExitIntentListener: (() => void) | null = null;

    private listeners: ExitIntentListener[] = [];

    constructor(private readonly style: IStyle) {
        this.exitIntentId = `fs-exit-intent-${this.style.guid}`;

        this.style.addStyle(this.getStyle());
    }

    public isAttached(): boolean {
        return null !== this.exitIntentDiv;
    }

    public addListener(...listeners: ExitIntentListener[]): void {
        this.listeners.push(...listeners);
    }

    public attach(...listeners: ExitIntentListener[]): IExitIntent {
        if (listeners) {
            this.addListener(...listeners);
        }

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
            if (!isExitAttempt(event)) {
                return;
            }

            delayTimer = window.setTimeout(() => {
                try {
                    this.fireListeners();
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

    private fireListeners() {
        this.listeners.forEach((listener) => {
            listener();
        });
    }

    private getStyle(): string {
        return /*@fs-css-minify*/ `#${this.exitIntentId} {
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
