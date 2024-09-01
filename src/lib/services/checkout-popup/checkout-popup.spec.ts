import { screen } from '@testing-library/dom';
import { Style } from '../style';
import { ExitIntent } from '../exit-intent';
import { Loader } from '../loader';
import { CheckoutPopup } from './index';
import { sendMockedCanceledEvent } from '../../../../tests/utils';

describe('CheckoutPopup', () => {
    test('should open and close the checkout popup', () => {
        const style = new Style('test-guid');
        const exitIntent = new ExitIntent(style);
        const loader = new Loader(style, 'test-url', 'test-alt');
        const baseUrl = 'https://checkout.freemius.com';
        const options = { plugin_id: 1, public_key: 'pk_12345678' };

        const checkoutPopup = new CheckoutPopup(
            style,
            exitIntent,
            loader,
            baseUrl,
            options
        );

        expect(
            screen.queryByTestId('fs-checkout-page-test-guid')
        ).not.toBeInTheDocument();

        expect(checkoutPopup.isOpen()).toBe(false);

        checkoutPopup.open();

        expect(
            screen.queryByTestId('fs-checkout-page-test-guid')
        ).toBeInTheDocument();

        expect(checkoutPopup.isOpen()).toBe(true);

        checkoutPopup.close();

        // Mock a message event to simulate the checkout being closed.
        sendMockedCanceledEvent();

        expect(
            screen.queryByTestId('fs-checkout-page-test-guid')
        ).not.toBeInTheDocument();

        expect(checkoutPopup.isOpen()).toBe(false);
    });

    // The rest of the behavior is tested in the main service test.
});
