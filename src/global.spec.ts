import './global';
import { Checkout } from '.';

describe('global declaration', () => {
    test('exposes FS global variable', () => {
        expect(window.FS).toBeDefined();
    });

    test('exposes Checkout global variable', () => {
        expect(window.FS.Checkout).toBe(Checkout);
    });
});
