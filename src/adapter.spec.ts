import './adapter';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';
import { screen } from '@testing-library/dom';

describe('adapter', () => {
    test('exposes FS global variable', () => {
        expect(window.FS).toBeDefined();
    });

    test('has the same signature as the old Checkout service', () => {
        expect('window.FS.Checkout.configure').toBeDefined();
        expect('window.FS.Logger').toBeDefined();
    });

    test('FS.Checkout.configure gives out a singleton', () => {
        const handlerOne = (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 123,
            public_key: '123',
        });

        const handlerTwo = (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 456,
            public_key: '456',
        });

        expect(handlerOne).toBe(handlerTwo);
    });

    test('everytime configure is called, the original option is held when opening', () => {
        const handlerOne = (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 123,
            public_key: '123',
            plan_id: 123,
        });

        (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 456,
            public_key: '456',
            plan_id: 456,
        });

        (window.FS.Checkout as IFSOldCheckout).open();

        const iFrame = screen.queryByTestId(
            `fs-checkout-page-${handlerOne.getGuid()}`
        ) as HTMLIFrameElement;

        expect(iFrame).toBeInTheDocument();

        expect(iFrame.src).toContain('plan_id=456');
        expect(iFrame.src).toContain('plugin_id=456');
        expect(iFrame.src).toContain('public_key=456');
    });
});
