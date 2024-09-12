// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Checkout } = require('../lib/module/checkout.cjs');

describe('lib.cjs', () => {
    test('exposes Checkout', () => {
        expect(Checkout).toBeDefined();
    });
});
