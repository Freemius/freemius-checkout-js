import type { CheckoutPopupEvents } from './contracts/CheckoutPopupOptions';
import { Checkout } from './checkout';
import { Dunning } from './services/dunning';
import { isSsr } from './utils/ops';

export async function restoreDunningIfPresent(
    events?: CheckoutPopupEvents
): Promise<Checkout | null> {
    if (isSsr()) {
        return null;
    }

    const dunning = new Dunning(window.location.href);

    if (dunning.hasDunning()) {
        const checkout = new Checkout(dunning.getCheckoutOptions());

        await checkout.open(events);

        return checkout;
    }

    return null;
}
