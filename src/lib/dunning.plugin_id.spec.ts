/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://example.com/custom-dunning?_fs_dunning=1&_fs_is_payment_method_update=1&_fs_license_id=81&_fs_authorization=FSLA-somesupersecretstring&_fs_plugin_id=55&_fs_plan_id=537"}
 */

import { screen } from '@testing-library/dom';
import { restoreDunningIfPresent } from './dunning';

afterEach(() => {
    if (window.FS) {
        window.FS.__FS__IS_TEST__ = false; // Reset the test flag after each test
    }
});

describe('Dunning', () => {
    test('restores the dunning information from the URL', async () => {
        const checkout = (await restoreDunningIfPresent())!;

        expect(checkout).toBeDefined();

        const guid = checkout.getGuid();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).toBeInTheDocument();

        const src = screen
            .getByTestId(`fs-checkout-page-${guid}`)
            .getAttribute('src');

        expect(src).not.toBeNull();

        expect(src).toContain('plugin_id=55');
        expect(src).toContain('dunning=1');
        expect(src).toContain('is_payment_method_update=1');
        expect(src).toContain('license_id=81');
        expect(src).toContain('plan_id=537');
        expect(src).toContain('authorization=FSLA-somesupersecretstring');
    });

    test('respects the window.FS.__FS__IS_TEST__ flag when set to true', async () => {
        if (!window.FS) {
            // @ts-ignore
            window.FS = {};
        }

        window.FS.__FS__IS_TEST__ = true; // Set the test flag

        const checkout = (await restoreDunningIfPresent())!;

        expect(checkout).toBeDefined();

        const src = screen
            .getByTestId(`fs-checkout-page-${checkout.getGuid()}`)
            .getAttribute('src');

        expect(src).toContain('http://checkout.freemius-local.com:8080');
    });

    test('respects the window.FS.__FS__IS_TEST__ flag when set to false', async () => {
        if (!window.FS) {
            // @ts-ignore
            window.FS = {};
        }

        window.FS.__FS__IS_TEST__ = false; // Set the test flag

        const checkout = (await restoreDunningIfPresent())!;

        expect(checkout).toBeDefined();

        const src = screen
            .getByTestId(`fs-checkout-page-${checkout.getGuid()}`)
            .getAttribute('src');

        expect(src).not.toContain('http://checkout.freemius-local.com:8080');
        expect(src).toContain('https://checkout.freemius.com'); // Default URL
    });
});
