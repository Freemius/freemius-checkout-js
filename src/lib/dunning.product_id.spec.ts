/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://example.com/custom-dunning?_fs_dunning=1&_fs_is_payment_method_update=1&_fs_license_id=81&_fs_authorization=FSLA-somesupersecretstring&_fs_product_id=55&_fs_plan_id=537"}
 */

import { screen } from '@testing-library/dom';
import { restoreDunningIfPresent } from './dunning';

describe('Dunning', () => {
    test('restores the dunning information from the URL', () => {
        const checkout = restoreDunningIfPresent()!;

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
});
