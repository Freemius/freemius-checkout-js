import './adapter';
import { Checkout } from '.';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';

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
        expect(handlerOne).toBeInstanceOf(Checkout);
    });
});
