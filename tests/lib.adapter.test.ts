// eslint-disable-next-line @typescript-eslint/no-require-imports
require('../lib/adapter/checkout.js');

describe('lib.adapter', () => {
    test('exposes Checkout', () => {
        expect((window.FS.Checkout as any).configure).toBeDefined();
    });
});
