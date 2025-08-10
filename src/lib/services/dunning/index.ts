import { CheckoutOptions } from '../../types';
import { getBoolFromQueryParam } from '../../utils/ops';

export class Dunning {
    private readonly parsedUrl: URL | null = null;

    constructor(url: string) {
        try {
            this.parsedUrl = new URL(url);
        } catch {
            this.parsedUrl = null;
        }
    }

    hasDunning(): boolean {
        if (!this.parsedUrl) {
            return false;
        }

        const dunningQueryParam =
            this.parsedUrl.searchParams.get('_fs_dunning');
        const pluginIdQueryParam =
            this.parsedUrl.searchParams.get('_fs_plugin_id') ??
            this.parsedUrl.searchParams.get('_fs_product_id');

        return (
            getBoolFromQueryParam(dunningQueryParam) &&
            null !== pluginIdQueryParam
        );
    }

    getCheckoutOptions(): CheckoutOptions {
        if (!this.parsedUrl) {
            throw new Error('No dunning information found in the URL.');
        }

        const params: CheckoutOptions = {
            product_id: '',
        };

        const searchParams = this.parsedUrl.searchParams;

        searchParams.forEach((value, key) => {
            if (key.startsWith('_fs_')) {
                const paramKey = key.replace('_fs_', '');
                params[paramKey] = value;
            }
        });

        if (Object.hasOwn(params, 'plugin_id')) {
            params.product_id = params.plugin_id!;
            delete params.plugin_id;
        }

        return params;
    }
}
