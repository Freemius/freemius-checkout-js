# FREEMIUS CHECKOUT JAVASCRIPT SDK

[![npm version](https://badge.fury.io/js/@freemius%2Fcheckout.svg)](https://badge.fury.io/js/@freemius%2Fcheckout)
![NPM Downloads](https://img.shields.io/npm/dw/@freemius/checkout)
[![Twitter](https://img.shields.io/twitter/follow/freemius.svg?style=social&label=@freemius)](https://twitter.com/freemius)

-   [Usage Guide](#usage-guide)
    -   [Using hosted CDN](#using-hosted-cdn)
    -   [Using NPM Package](#using-npm-package)
-   [API](#api)
    -   [Instantiate the class](#instantiate-the-class)
    -   [Calling the method](#calling-the-method)
-   [Use with React](#use-with-react)
-   [Testing with Sandbox](#testing-with-sandbox)
-   [Migration guide from the old checkout JS](#migration-guide-from-the-old-checkout-js)
-   [Contributing](#contributing)

## Usage Guide

Here's a simple example to get you started.

```html
<select id="licenses">
    <option value="1" selected="selected">Single Site License</option>
    <option value="2">2-Site License</option>
    <option value="unlimited">Unlimited Sites License</option>
</select>
<button id="purchase">Buy Button</button>

<script
    type="text/javascript"
    src="https://checkout.freemius.com/js/v2/"
></script>

<script type="text/javascript">
    const handler = new FS.Checkout({
        plugin_id: '9885',
        plan_id: '16634',
        public_key: 'pk_ccca7be7fa43aec791448b43c6266',
        image: 'https://your-plugin-site.com/logo-100x100.png',
    });

    document.querySelector('#purchase').addEventListener('click', (e) => {
        handler.open({
            name: 'My Awesome Plugin',
            licenses: document.querySelector('#licenses').value,
            // You can consume the response for after purchase logic.
            purchaseCompleted: function (response) {
                // The logic here will be executed immediately after the purchase confirmation.
                // alert(response.user.email);
            },
            success: function (response) {
                // The logic here will be executed after the customer closes the checkout, after a successful purchase.
                // alert(response.user.email);
            },
        });

        e.preventDefault();
    });
</script>
```

Please find detailed guides below.

> **NOTE**: If you're migrating from the old checkout JS, please see the
> [migration guide](#migration-guide-from-the-old-checkout-js).

### Using hosted CDN

To use the hosted CDN, simply include the script tag in your HTML.

```html
<script
    type="text/javascript"
    src="https://checkout.freemius.com/js/v2/"
></script>
```

This will add the global `FS.Checkout` class which you can instantiate.

You can also load the script using the `async` or `defer` attribute on the
script tag. Note, however, that with asynchronous loading any API calls will
have to be made only after the script execution has finished. For that you'll
need to hook to `load` event of `window` or use `window.onload`.

```html
<script
    type="text/javascript"
    src="https://checkout.freemius.com/js/v2/"
    async
    defer
></script>

<script type="text/javascript">
    window.addEventListener('load', () => {
        const handler = new FS.Checkout({
            plugin_id: '1234',
            public_key: 'pk_xxxx',
        });

        handler.open({
            // plan
            plan_id: 9999,
            // number of sites
            licenses: 1,
            // billing cycles
            billing_cycle: 'annual',
        });
    });
</script>
```

### Using NPM Package

You can also use the official
[npm](https://www.npmjs.com/package/@freemius/checkout) package.

```bash
npm i @freemius/checkout
# If using yarn
yarn add @freemius/checkout
```

Once installed you can import the package and use it in your project.

```js
import { Checkout } from '@freemius/checkout';

// instantiate
const handler = new Checkout({
    plugin_id: '1234',
    public_key: 'pk_xxxx',
});

// Call the API
document.querySelector('#mybutton').addEventListener('click', (e) => {
    e.preventDefault();
    // call the open method
    handler.open({
        // plan
        plan_id: 9999,
        // number of sites
        licenses: 1,
        // billing cycles
        billing_cycle: 'annual',
    });
});
```

## API

Both the constructor and the `open` method accepts the following set of options.

All the
[official options](https://freemius.com/help/documentation/selling-with-freemius/freemius-checkout-buy-button/)
are supported here, along with some additional options.

```ts
interface AdditionalCheckoutOptions {
    /**
     * Optional callback to execute when the iFrame opens.
     *
     * @new
     */
    afterOpen?: () => void;

    /**
     * An optional callback to execute when the iFrame closes.
     *
     * @new
     */
    afterClose?: () => void;
    /**
     * Optional callback to trigger on exit intent. This is called only when the
     * checkout iFrame is shown, not on global exit intent.
     *
     * @new
     */
    onExitIntent?: () => void;

    /**
     * If you would like the dialog to open in sandbox mode,
     */
    sandbox?: {
        ctx: string;
        token: string;
    };
    /**
     * The URL of the image to display while the checkout is loading. By default a loading indicator from Freemius will be used.
     */
    loadingImageUrl?: string;
    /**
     * The alt text for the loading image. By default 'Loading Freemius Checkout' will be used.
     */
    loadingImageAlt?: string;
}
```

For testing with sandbox API, see the [relevant section](#testing-with-sandbox).

### Instantiate the class

The main class exported by the package is `Checkout`. For the hosted CDN it is
available under the global `FS` namespace.

```js
const handler = new FS.Checkout({
    plugin_id: '1234',
    public_key: 'pk_xxxx',
});
```

If you're using the package from npm, you simply import it and create an
instance.

```js
import { Checkout } from 'freemius-checkout-js';

// instantiate
const handler = new Checkout({
    plugin_id: '0001',
    public_key: 'pk_xxxx',
});
```

Note that the `plugin_id` and `public_key` are required parameters and must be
supplied during instantiation.

### Calling the method

Now you can simply call the `open` method to show the checkout popup.

```js
handler.open();
```

You can also pass additional options

```js
handler.open({
    // plan
    plan_id: 9999,
    // number of sites
    licenses: 1,
    // billing cycles
    billing_cycle: 'annual',
});
```

This is useful when you have multiple checkouts related to different plans,
billing cycles, licenses, trials etc.

See the [source code of the demo](./src/demo.ts) to learn more.

To close the popup programmatically, call the `close` method.

```js
handle.close();
```

## Use with React

We will make a small react hook. Here we assume the `plugin_id` and `public_key`
are available in
[some environment variable](https://create-react-app.dev/docs/adding-custom-environment-variables/).

**checkout.ts**

```tsx
import { Checkout, CheckoutOptions } from '@freemius/checkout';
import { useState, useEffect } from 'react';

export const checkoutConfig: CheckoutOptions = {
    plugin_id: process.env.REACT_APP_PLUGIN_ID as string,
    public_key: process.env.REACT_APP_PUBLIC_KEY as string,
};

export function useFSCheckout() {
    // create a Checkout instance once
    const [fsCheckout] = useState<Checkout>(() => new Checkout(checkoutConfig));

    useEffect(() => {
        // close and destroy the DOM related stuff on unmount
        return () => {
            fsCheckout.destroy();
        };
    }, [fsCheckout]);

    return fsCheckout;
}
```

Now we use in our component.

**App.tsx**

```tsx
import React from 'react';
import { useFSCheckout } from './checkout.ts';

export default function App() {
    const fsCheckout = useFSCheckout();

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                fsCheckout.open({
                    plan_id: 1234,
                    licenses: 1,
                    billing_cycle: 'annual',
                    success: (data) => {
                        console.log(data);
                    },
                });
            }}
        >
            Buy Plan
        </button>
    );
}
```

## Testing with Sandbox

To get the sandbox token and ctx, follow the steps:

1. Go to the Developer Dashboard.
2. Under Plans click on the "Get Checkout Code" button.
3. Go to the Sandbox tab.
4. Copy the `sandbox_token` and `timestamp` values.

The value of `sandbox` is token and value of `s_ctx_ts` is ctx. So for the above
value, the configuration would look like

```js
const config = {
    // ...
    sandbox: {
        token: 'xxxxxxxx',
        ctx: '00000000',
    },
};
```

**NOTICE**: Use this only during development and never publish the token and
context. In this repository we use the `.env` file for storing sandbox data.

## Migration guide from the old checkout JS

If you've been using the old `checkout.freemius.com/checkout.min.js` script then
this guide is for you. We have introduced a compatibility layer using which you
can very easily migrate to the new checkout JS.

In your code, where you do

```html
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://checkout.freemius.com/checkout.min.js"></script>
```

1. Remove the jQuery script tag if you aren't using jQuery.
2. Replace the checkout script with the new one.

```html
<script src="https://checkout.freemius.com/js/v2/migrate/"></script>
```

Now all your existing code should work as is.

```js
const handler = FS.Checkout.configure({
    plugin_id: '1234',
    plan_id: '5678',
    public_key: 'pk_ccca7be7fa43aec791448b43c6266',
    image: 'https://your-plugin-site.com/logo-100x100.png',
});

document.querySelector('#purchase').addEventListener('click', (e) => {
    handler.open({
        name: 'My Awesome Plugin',
        licenses: document.querySelector('#licenses').value,
        // You can consume the response for after purchase logic.
        purchaseCompleted: function (response) {
            // The logic here will be executed immediately after the purchase confirmation.
            // alert(response.user.email);
        },
        success: function (response) {
            // The logic here will be executed after the customer closes the checkout, after a successful purchase.
            // alert(response.user.email);
        },
    });

    e.preventDefault();
});
```

Please note that because of the singleton pattern of the old checkout JS, we do
recommend using the new API directly. The compatibility layer is only for quick
migration. With the singleton pattern, every time you call the `configure` the
original option will be overridden. While managing multiple checkouts, this can
lead to confusion.

## Contributing

We welcome contributions! Please see the
[contribution guide](./CONTRIBUTING.md).
