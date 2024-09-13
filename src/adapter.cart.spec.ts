/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "http://localhost/pricing/?__fs_auth_date=Tue%2C+03+Sep+2024+10%3A57%3A45+%2B0000&__fs_authorization=FSE+9885%3AFq28cI8tXbGkuMc7Up-A632PqvplKYYTbz9JEjdgXR3Rlc2PrxbUs_bmJsnCtzYZ7obXDcGz2gOe_3GvFl_dj141aTyF07LLGsZbpHwTnxxjug20VW1j0QAV49n9UN_1ZfHJ-mQvzh866Lvtq1BbYQ&__fs_expires_in=31536000&__fs_plugin_id=1&__fs_plugin_public_key=pk_ccca7be7fa43aec791448b43c6266&plugin_id=1&plan_id=16635"}
 */

import { screen } from '@testing-library/dom';
import './adapter';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';
import { sendMockedCanceledEvent } from '../tests/utils';

describe('Adapter with Cart', () => {
    test('recovers cart belonging to the same plugin with a singleton', () => {
        const handler = (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 1,
            public_key: 'pk_123456',
        });

        const guid = handler.getGuid();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).toBeInTheDocument();
    });

    test('recovers cart belonging to a different plugin with a singleton', () => {
        const handler = (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 2,
            public_key: 'pk_123456',
        });

        const guid = handler.getGuid();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).toBeInTheDocument();

        sendMockedCanceledEvent();

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).not.toBeInTheDocument();

        // Call the configure again, it shouldn't recover the cart.
        (window.FS.Checkout as IFSOldCheckout).configure({
            plugin_id: 2,
            public_key: 'pk_123456',
        });

        expect(
            screen.queryByTestId(`fs-checkout-page-${guid}`)
        ).not.toBeInTheDocument();
    });
});
