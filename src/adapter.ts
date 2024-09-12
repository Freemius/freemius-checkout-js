/**
 * Backward compatible adapter for the checkout service.
 */
import './global';
import { CheckoutOptions, Checkout } from '.';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';

class FSOldCheckout implements IFSOldCheckout {
    private checkout: Checkout | null = null;

    configure(options: CheckoutOptions): Checkout {
        if (!this.checkout) {
            this.checkout = new Checkout(options, false);

            // Manually recover any cart (not just belonging to the plugin) since we are using a singleton.
            if (this.checkout.cart?.hasCart()) {
                // Force recover the cart because we would have a singleton only for this use-case.
                const cartOptions = this.checkout.cart?.getCheckoutOptions();
                this.checkout.open(cartOptions);
            }
        }

        return this.checkout;
    }

    public open({ plugin_id, public_key, ...options }: CheckoutOptions) {
        this.configure({ plugin_id, public_key }).open(options);
    }

    public close() {
        this.checkout?.close();
    }

    clearOptions(): void {
        this.checkout = null;
    }
}

window.FS.Checkout = new FSOldCheckout();
