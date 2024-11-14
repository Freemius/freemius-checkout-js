import { Checkout, CheckoutOptions, CheckoutPopupOptions } from '.';

import './style.css';

const fsCheckout = new Checkout(
    {
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
        user_token: import.meta.env.VITE_USER_TOKEN as string,
    },
    true,
    import.meta.env.VITE_CHECKOUT_BASE_URL ?? undefined
);

document.addEventListener('DOMContentLoaded', () => {
    function getLicensesAndFrequency() {
        let licenses = 1;
        const siteSelect = document.querySelector('#site');
        if (siteSelect) {
            licenses = Number.parseInt(
                (siteSelect as HTMLSelectElement).value,
                10
            );
        }
        let billing_cycle: CheckoutOptions['billing_cycle'] = 'annual';
        const freqSelect = document.querySelector('#frequency');
        if (freqSelect) {
            billing_cycle = (freqSelect as HTMLSelectElement).value as any;
        }
        return { licenses, billing_cycle };
    }

    function getEventLoggers(): Pick<
        CheckoutPopupOptions,
        | 'cancel'
        | 'purchaseCompleted'
        | 'success'
        | 'track'
        | 'afterOpen'
        | 'afterClose'
        | 'onExitIntent'
    > {
        const log = (event: string, ...args: any[]) => {
            console.log(
                `%c FSCheckout %c :: %c ${event} %c`,
                'background: #C62828; color: white;',
                'background: transparent;',
                'background: #283593; color: white;',
                'background: transparent;'
            );
            if (args.length) {
                console.log(...args);
            }
        };

        return {
            cancel() {
                log('cancel');
            },
            purchaseCompleted(data) {
                log('purchaseCompleted', data);
            },
            success(data) {
                log('success', data);
            },
            track(event, data) {
                log('track', event, data);
            },
            afterOpen() {
                log('afterOpen');
            },
            afterClose() {
                log('afterClose');
            },
            onExitIntent() {
                log('exitIntent');
            },
        };
    }

    const plans = {
        '#plan-1': import.meta.env.VITE_PLAN_ONE as string,
        '#plan-2': import.meta.env.VITE_PLAN_TWO as string,
        '#plan-3': import.meta.env.VITE_PLAN_THREE as string,
    };

    Object.entries(plans).forEach(([selector, planId]) => {
        if (!planId) {
            document.querySelector(selector)?.remove();
        } else {
            document.querySelector(selector)?.addEventListener('click', (e) => {
                e.preventDefault();
                fsCheckout.open({
                    plan_id: Number.parseInt(planId, 10),
                    ...getLicensesAndFrequency(),
                    ...getEventLoggers(),
                });
            });
        }
    });

    console.log(
        '%cCheckout API available as %cfsCheckout%c global variable',
        'font-size: 20px; ',
        'font-size: 20px; background-color: #B71C1C; color: white;',
        'font-size: 20px; background-color: transparent; '
    );
    (window as any).fsCheckout = fsCheckout;
});
