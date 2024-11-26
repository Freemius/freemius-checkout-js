import {
    CheckoutPopupArbitraryParams,
    CheckoutPopupOptions,
} from '../../contracts/CheckoutPopupOptions';
import { assertNotNull } from '../../utils/ops';

/**
 * @note - URL has the following search params when cart is present: ?__fs_auth_date=Tue%2C+03+Sep+2024+10%3A57%3A45+%2B0000&__fs_authorization=FSE+9885%3AFq28cI8tXbGkuMc7Up-A632PqvplKYYTbz9JEjdgXR3Rlc2PrxbUs_bmJsnCtzYZ7obXDcGz2gOe_3GvFl_dj141aTyF07LLGsZbpHwTnxxjug20VW1j0QAV49n9UN_1ZfHJ-mQvzh866Lvtq1BbYQ&__fs_expires_in=31536000&__fs_plugin_id=9885&__fs_plugin_public_key=pk_ccca7be7fa43aec791448b43c6266&plugin_id=9885&plan_id=16635
 */
export class Cart {
    private readonly queryParams: Record<string, string> | null = null;

    static readonly NO_CART_FOUND_MESSAGE = 'No cart was found';

    constructor(private readonly url: URL) {
        this.queryParams = this.parseQueryStringForCart();
    }

    hasCart(): boolean {
        return this.queryParams !== null;
    }

    getPluginID(): string {
        assertNotNull(this.queryParams, Cart.NO_CART_FOUND_MESSAGE);

        return this.queryParams.__fs_plugin_id;
    }

    getPluginPublicKey(): string {
        assertNotNull(this.queryParams, Cart.NO_CART_FOUND_MESSAGE);

        return this.queryParams.__fs_plugin_public_key;
    }

    matchesPluginID(pluginID: number | string): boolean {
        const cartPluginID = Number.parseInt(this.getPluginID(), 10);
        const requestedPluginID = Number.parseInt(pluginID.toString(), 10);

        return (
            Number.isFinite(cartPluginID) &&
            Number.isFinite(requestedPluginID) &&
            cartPluginID === requestedPluginID
        );
    }

    getCheckoutOptions(): CheckoutPopupOptions & CheckoutPopupArbitraryParams {
        assertNotNull(this.queryParams, Cart.NO_CART_FOUND_MESSAGE);

        const params: CheckoutPopupOptions & CheckoutPopupArbitraryParams = {
            plugin_id: '',
            public_key: '',
        };

        Object.entries(this.queryParams).forEach(([key, value]) => {
            if ('__fs_plugin_id' === key) {
                params.plugin_id = value;
            } else if ('__fs_plugin_public_key' === key) {
                params.public_key = value;
            } else {
                params[key] = value;
            }
        });

        return params;
    }

    private parseQueryStringForCart(): Record<string, string> | null {
        const AUTH_PARAM = '__fs_authorization';
        const searchParams = new URLSearchParams(this.url.search);

        if (!searchParams.has(AUTH_PARAM)) {
            return null;
        }

        // Return all query params that starts with __fs_
        const fsParams: Record<string, any> = {};

        searchParams.forEach((value, key) => {
            if (key.startsWith('__fs_')) {
                fsParams[key] = value;
            }
        });

        return fsParams;
    }
}
