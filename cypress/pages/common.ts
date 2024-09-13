import { CheckoutOptions, CheckoutPopupEvents } from '../../src';

export const initOptions: CheckoutOptions = {
    plugin_id: Number.parseInt(
        (import.meta.env.VITE_PLUGIN_ID as string) ?? '0',
        10
    ),
    public_key: import.meta.env.VITE_PUBLIC_KEY as string,
    sandbox: {
        ctx: import.meta.env.VITE_SANDBOX_CTX as string,
        token: import.meta.env.VITE_SANDBOX_TOKEN as string,
    },
    language: 'auto-beta',
};

export const baseUrl: string | undefined =
    import.meta.env.VITE_CHECKOUT_BASE_URL ?? undefined;

const updateEventText = (text: string) => {
    const eventLog = document.querySelector('#event-log');
    if (eventLog) {
        eventLog.innerHTML += `\n${text} at ${new Date().toLocaleTimeString()}<br>`;
    }
};

export function resetEventText() {
    const eventLog = document.querySelector('#event-log');
    if (eventLog) {
        eventLog.innerHTML = '';
    }
}

export enum EVENT_LOG {
    CANCEL = 'cancel',
    TRACK = 'track',
    PURCHASE_COMPLETED = 'purchaseCompleted',
    SUCCESS = 'success',
    AFTER_OPEN = 'afterOpen',
    AFTER_CLOSE = 'afterClose',
    ON_EXIT_INTENT = 'onExitIntent',
}

export const eventListeners: CheckoutPopupEvents = {
    cancel() {
        updateEventText(EVENT_LOG.CANCEL);
    },
    afterClose() {
        updateEventText(EVENT_LOG.AFTER_CLOSE);
    },
    success() {
        updateEventText(EVENT_LOG.SUCCESS);
    },
    track(event) {
        updateEventText(`${EVENT_LOG.TRACK}: ${event}`);
    },
    afterOpen() {
        updateEventText(EVENT_LOG.AFTER_OPEN);
    },
    purchaseCompleted() {
        updateEventText(EVENT_LOG.PURCHASE_COMPLETED);
    },
    onExitIntent() {
        updateEventText(EVENT_LOG.ON_EXIT_INTENT);
    },
};
