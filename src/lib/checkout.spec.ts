import { screen } from '@testing-library/dom';
import { Checkout } from './checkout';
import { sendMockedCanceledEvent } from '../../tests/utils';
import { createHydratedMock } from 'ts-auto-mock';
import {
    CheckoutPopupOptions,
    CheckoutPopupParams,
} from './contracts/CheckoutPopupOptions';
import { getQueryValueFromItem } from './utils/ops';

describe('CheckoutPopup', () => {
    test('should open and close the checkout popup', () => {
        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_12345678',
            loadingImageAlt: 'Loading Freemius Checkout',
        });

        const guid = checkout.getGuid();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).not.toBeInTheDocument();

        checkout.open();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).toBeInTheDocument();

        expect(
            screen.queryByAltText('Loading Freemius Checkout')
        ).toBeInTheDocument();

        checkout.close();
        sendMockedCanceledEvent();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByAltText('Loading Freemius Checkout')
        ).not.toBeInTheDocument();
    });

    test('overrides the options with the open method', () => {
        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_12345678',
            loadingImageAlt: 'Loading Freemius Checkout',
            currency: 'usd',
        });

        const guid = checkout.getGuid();

        checkout.open({
            currency: 'eur',
        });

        const iFrame = screen.queryByTestId(
            `fs-checkout-page-${guid}`
        ) as HTMLIFrameElement;

        expect(iFrame).toBeInTheDocument();

        expect(iFrame.src).not.toContain('currency=usd');
        expect(iFrame.src).toContain('currency=eur');
    });

    test('restores the scroll position after closing the checkout popup', () => {
        document.documentElement.scrollTop = 100;
        document.documentElement.scrollLeft = 100;

        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_12345678',
        });

        checkout.open();

        // Mock some scrolling
        document.documentElement.scrollTop = 200;
        document.documentElement.scrollLeft = 200;

        sendMockedCanceledEvent();

        expect(document.documentElement.scrollTop).toBe(100);
        expect(document.documentElement.scrollLeft).toBe(100);
    });

    test('restores meta color scheme after closing the checkout popup', () => {
        const metaColorSchemeElement = document.createElement('meta');
        metaColorSchemeElement.name = 'color-scheme';
        metaColorSchemeElement.content = 'dark';

        document.head.appendChild(metaColorSchemeElement);

        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_12345678',
        });

        checkout.open();

        expect(metaColorSchemeElement.getAttribute('content')).toBe('light');

        sendMockedCanceledEvent();

        expect(metaColorSchemeElement.getAttribute('content')).toBe('dark');
    });

    test('passes all the required internal query parameters', () => {
        const mockedOption = createHydratedMock<CheckoutPopupParams>({
            plugin_id: 1,
            public_key: 'pk_123456',
            sandbox: {
                ctx: '123123123',
                token: '83798sdhfk768',
            },
        });

        const checkout = new Checkout(mockedOption);
        checkout.open();

        const guid = checkout.getGuid();

        const iFrame = screen.queryByTestId(
            `fs-checkout-page-${guid}`
        ) as HTMLIFrameElement;

        expect(iFrame).toBeInTheDocument();

        Object.entries(mockedOption).forEach(([key, value]) => {
            if (key === 'sandbox') {
                return;
            }

            expect(iFrame.src).toContain(
                `${key}=${getQueryValueFromItem(value)}`
            );
        });

        expect(iFrame.src).toContain('s_ctx_ts=123123123');
        expect(iFrame.src).toContain('sandbox=83798sdhfk768');
    });

    test('passes all undocumented query parameters', () => {
        const option: CheckoutPopupOptions = {
            plugin_id: 1,
            public_key: 'pk_123456',
            foo: 'bar',
        };

        const checkout = new Checkout(option);
        checkout.open();

        const guid = checkout.getGuid();

        const iFrame = screen.queryByTestId(
            `fs-checkout-page-${guid}`
        ) as HTMLIFrameElement;

        expect(iFrame).toBeInTheDocument();

        expect(iFrame.src).toContain('foo=bar');
    });

    test('passes all internal parameters', () => {
        const internals = ['mode', 'guid', '_fs_checkout'];

        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_123456',
        });
        checkout.open();

        const guid = checkout.getGuid();

        const iFrame = screen.queryByTestId(
            `fs-checkout-page-${guid}`
        ) as HTMLIFrameElement;

        expect(iFrame).toBeInTheDocument();

        internals.forEach((key) => {
            expect(iFrame.src).toContain(`${key}=`);
        });
    });

    test('properly encodes the query parameters', () => {
        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_123456',
            license_key: 'sk_R-5E2+%20BD:.kp*(Oq2aodhzZ1Jw',
        });
        checkout.open();

        const guid = checkout.getGuid();

        const iFrame = screen.queryByTestId(
            `fs-checkout-page-${guid}`
        ) as HTMLIFrameElement;

        expect(iFrame).toBeInTheDocument();

        expect(
            new URL(iFrame.src).searchParams.get('license_key')
        ).toMatchInlineSnapshot(`"sk_R-5E2+%20BD:.kp*(Oq2aodhzZ1Jw"`);
    });
});
