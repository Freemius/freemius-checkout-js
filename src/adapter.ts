/**
 * Backward compatible adapter for the checkout service.
 */
import './global';
import { Checkout, CheckoutOptions } from '.';
import { IFSOldCheckout } from './lib/contracts/IFSOldCheckout';

class FSOldCheckout implements IFSOldCheckout {
    private checkout: Checkout | null = null;

    private options: CheckoutOptions | null = null;

    configure(options: CheckoutOptions, baseUrl?: string): IFSOldCheckout {
        if (!this.checkout) {
            this.checkout = new Checkout(options, false, baseUrl);

            /**
             * Manually recover any cart (not just belonging to the plugin) since we are using a singleton.
             *
             * @note - In the legacy library, the cart was recovered everytime the configure was called, which could lead to UI/UX issues.
             *         Hence, we are doing it only once, unless `clearOptions` is called, which means a sort of hard-reset.
             */
            if (this.checkout.cart?.hasCart()) {
                // Force recover the cart because we would have a singleton only for this use-case.
                const cartOptions = this.checkout.cart?.getCheckoutOptions();
                this.checkout.open(cartOptions);
            }
        }

        this.options = options;

        return this;
    }

    public open(options: Partial<CheckoutOptions> = {}) {
        const checkout =
            this.checkout ?? this.configure(options as CheckoutOptions);

        checkout.open({
            ...(this.options ?? {}),
            ...(options as Omit<CheckoutOptions, 'plugin_id' | 'product_id'>),
        });
    }

    public close() {
        this.checkout?.close();
    }

    clearOptions(): void {
        this.options = null;
    }

    public getGuid() {
        return this.checkout?.getGuid() ?? '';
    }
}

window.FS.Checkout = new FSOldCheckout();

// @note - This export is needed so that vite library compiler wraps the code in a function (iife)
export { FSOldCheckout };
