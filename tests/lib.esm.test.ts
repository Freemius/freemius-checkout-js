describe('lib.esm', () => {
    test('exposes Checkout', async () => {
        const { Checkout } = await import('../lib/module/checkout.js');
        expect(Checkout).toBeDefined();
    });
});
