/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "http://localhost/pricing/?__fs_auth_date=Tue%2C+03+Sep+2024+10%3A57%3A45+%2B0000&__fs_authorization=FSE+9885%3AFq28cI8tXbGkuMc7Up-A632PqvplKYYTbz9JEjdgXR3Rlc2PrxbUs_bmJsnCtzYZ7obXDcGz2gOe_3GvFl_dj141aTyF07LLGsZbpHwTnxxjug20VW1j0QAV49n9UN_1ZfHJ-mQvzh866Lvtq1BbYQ&__fs_expires_in=31536000&__fs_plugin_id=1&__fs_plugin_public_key=pk_ccca7be7fa43aec791448b43c6266&plugin_id=1&plan_id=16635"}
 */

import { screen } from '@testing-library/dom';
import { Checkout } from './checkout';

// Make sure that setting the jest environment options in the file works, just to fail earlier.
test('test runs with the correct URL', () => {
    expect(window.location.href).toContain('__fs_auth_');
});

describe('Checkout with Cart', () => {
    test("should open automatically if the cart is present in the URL and cart's plugin ID matches", () => {
        const checkout = new Checkout({
            plugin_id: 1,
            public_key: 'pk_123456',
        });

        const guid = checkout.getGuid();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).toBeInTheDocument();

        const src = screen
            .getByTestId(`fs-checkout-page-${guid}`)
            .getAttribute('src');

        expect(src).not.toBeNull();

        expect(src).toContain('plugin_id=1');
        expect(src).toContain('public_key=');
        expect(src).toContain('__fs_auth_date');
        expect(src).toContain('__fs_authorization');

        const url = new URL(src!);
        const search = new URLSearchParams(url.search);

        expect(search.get('__fs_authorization')).toMatchInlineSnapshot(
            `"FSE 9885:Fq28cI8tXbGkuMc7Up-A632PqvplKYYTbz9JEjdgXR3Rlc2PrxbUs_bmJsnCtzYZ7obXDcGz2gOe_3GvFl_dj141aTyF07LLGsZbpHwTnxxjug20VW1j0QAV49n9UN_1ZfHJ-mQvzh866Lvtq1BbYQ"`
        );
        expect(search.get('__fs_auth_date')).toMatchInlineSnapshot(
            `"Tue, 03 Sep 2024 10:57:45 +0000"`
        );
        expect(search.get('__fs_expires_in')).toMatchInlineSnapshot(
            `"31536000"`
        );
    });

    test("should not open automatically if the cart is present in the URL and cart's plugin ID does not match", () => {
        const checkout = new Checkout({
            plugin_id: 2,
            public_key: 'pk_123456',
        });

        const guid = checkout.getGuid();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).not.toBeInTheDocument();
    });
});
