import { postman, PostmanEvents } from '../postman';
import { CheckoutPopupEvents } from '../../contracts/CheckoutPopupOptions';
import { buildFreemiusQueryFromOptions } from '../../utils/ops';
import { Logger } from '../logger';
import { IExitIntent } from '../exit-intent';

export class CheckoutIFrame {
    private postman: PostmanEvents | null = null;
    private readonly iFrame: HTMLIFrameElement;

    constructor(
        private readonly baseUrl: string,
        queryParams: Record<string, any>,
        iFrameID: string,
        private readonly visibleClass: string,
        private readonly checkoutEvents: CheckoutPopupEvents
    ) {
        // Create the iFrame
        const src = `${baseUrl}/?${buildFreemiusQueryFromOptions(
            queryParams
        )}#${encodeURIComponent(document.location.href)}`;

        const iFrame = document.createElement('iframe');
        iFrame.id = iFrameID;
        iFrame.src = src;

        this.iFrame = iFrame;
    }

    attach(onLoad?: () => void, onClose?: () => void) {
        this.attachIFrame();
        this.addEventListeners(onLoad, onClose);
    }

    close() {
        // Send the close signal to the checkout popup, Freemium might do some things like showing FOMO etc.
        this.postman?.post('close', null);
    }

    addToExitIntent(exitIntent: IExitIntent) {
        exitIntent.addListener(() => {
            this.postman?.post('exit_intent', null);
            this.checkoutEvents.onExitIntent?.();
        });
    }

    private attachIFrame() {
        this.iFrame.setAttribute('allowTransparency', 'true');
        this.iFrame.setAttribute('width', '100%');
        this.iFrame.setAttribute('height', '100%');
        this.iFrame.setAttribute(
            'style',
            'background: rgba(0,0,0,0.003); border: 0 none transparent;'
        );
        this.iFrame.setAttribute('frameborder', '0');

        // @todo - Remove this and update the tests.
        if (process.env.NODE_ENV === 'test') {
            this.iFrame.setAttribute('data-testid', this.iFrame.id);
        }

        document.body.appendChild(this.iFrame);
    }

    private addEventListeners(onLoad?: () => void, onClose?: () => void) {
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

                onClose?.();
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

                onClose?.();
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
                onLoad?.();

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
    }
}
