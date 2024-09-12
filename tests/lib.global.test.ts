// eslint-disable-next-line @typescript-eslint/no-require-imports
require('../lib/global/checkout.js');

describe('lib.global', () => {
    test('exposes Checkout', () => {
        expect(window.FS.Checkout).toBeDefined();
    });
});
