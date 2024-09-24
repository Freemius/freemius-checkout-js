import { postman, PostmanEvents } from '../postman';
import { CheckoutPopupEvents } from '../../contracts/CheckoutPopupOptions';
import { buildFreemiusQueryFromOptions } from '../../utils/ops';
import { Logger } from '../logger';
import { IExitIntent } from '../../contracts/IExitIntent';

type EventListener = () => void;

export class CheckoutIFrame {
    private postman: PostmanEvents | null = null;

    private readonly iFrame: HTMLIFrameElement;

    private readonly loadedEventListeners: Set<EventListener> = new Set();

    private readonly closedEventListeners: Set<EventListener> = new Set();

    constructor(
        private readonly baseUrl: string,
        queryParams: Record<string, string>,
        iFrameID: string,
        private readonly visibleClass: string,
        private readonly checkoutEvents: CheckoutPopupEvents
    ) {
        this.iFrame = this.attachIFrame(baseUrl, queryParams, iFrameID);
        this.addEventListeners();
    }

    close() {
        // Send the close signal to the checkout popup, Freemium might do some things like showing FOMO etc.
        this.postman?.post('close', null);
    }

    onClosed(callback: EventListener) {
        this.closedEventListeners.add(callback);
    }

    onLoaded(callback: EventListener) {
        this.loadedEventListeners.add(callback);
    }

    addToExitIntent(exitIntent: IExitIntent) {
        exitIntent.addListener(() => {
            this.postman?.post('exit_intent', null);
            this.checkoutEvents.onExitIntent?.();
        });
    }

    private attachIFrame(
        baseUrl: string,
        queryParams: Record<string, string>,
        iFrameID: string
    ): HTMLIFrameElement {
        const src = `${baseUrl}/?${buildFreemiusQueryFromOptions(
            queryParams
        )}#${encodeURIComponent(document.location.href)}`;

        const iFrame = document.createElement('iframe');
        iFrame.id = iFrameID;
        iFrame.src = src;

        iFrame.setAttribute('allowTransparency', 'true');
        iFrame.setAttribute('width', '100%');
        iFrame.setAttribute('height', '100%');
        iFrame.setAttribute(
            'style',
            'background: rgba(0,0,0,0.003); border: 0 none transparent;'
        );
        iFrame.setAttribute('frameborder', '0');

        iFrame.setAttribute('data-testid', iFrame.id);

        document.body.appendChild(iFrame);

        return iFrame;
    }

    private addEventListeners() {
        const {
            success,
            purchaseCompleted,
            cancel,
            track,
            afterOpen,
            afterClose,
        } = this.checkoutEvents;

        this.postman = postman(this.iFrame, this.baseUrl);

        this.postman?.one(
            'upgraded',
            (data) => {
                try {
                    success?.(data as any);
                } catch (e) {
                    Logger.Error(e);
                }

                this.dispatchOnClosed();
                this.removeIFrameAndPostman();
                afterClose?.();
            },
            true
        );

        this.postman?.one(
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

        this.postman?.one(
            'canceled',
            () => {
                try {
                    cancel?.();
                } catch (e) {
                    Logger.Error(e);
                }

                this.dispatchOnClosed();
                this.removeIFrameAndPostman();
                afterClose?.();
            },
            true
        );

        this.postman?.on('track', (data) => {
            try {
                track?.((data as any).event, data as any);
            } catch (e) {
                Logger.Error(e);
            }
        });

        this.postman?.one(
            'loaded',
            () => {
                this.dispatchOnLoaded();

                this.iFrame?.classList.add(this.visibleClass);

                // call the afterOpen handler
                try {
                    afterOpen?.();
                } catch (e) {
                    Logger.Error(e);
                }
            },
            true
        );
    }

    private removeIFrameAndPostman() {
        this.postman?.destroy();
        this.postman = null;

        this.iFrame.remove();

        // Reset the event listeners
        this.closedEventListeners.clear();
        this.loadedEventListeners.clear();
    }

    private dispatchOnLoaded() {
        this.loadedEventListeners.forEach((listener) => listener());
    }

    private dispatchOnClosed() {
        this.closedEventListeners.forEach((listener) => listener());
    }
}
