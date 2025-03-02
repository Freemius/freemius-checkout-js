# FREEMIUS CHECKOUT JAVASCRIPT SDK

[![npm version](https://badge.fury.io/js/@freemius%2Fcheckout.svg)](https://badge.fury.io/js/@freemius%2Fcheckout)
![NPM Downloads](https://img.shields.io/npm/dw/@freemius/checkout)
[![Twitter](https://img.shields.io/twitter/follow/freemius.svg?style=social&label=@freemius)](https://twitter.com/freemius)

-   [Usage Guide](#usage-guide)
    -   [Using hosted CDN](#using-hosted-cdn)
-   [API](#api)
    -   [Instantiate the class](#instantiate-the-class)
    -   [Calling the method](#calling-the-method)
-   [Use with React](#use-with-react)
-   [Testing with Sandbox](#testing-with-the-sandbox)
-   [Migration guide](#migration-guide)
-   [Contributing](#contributing)

## Usage Guide

Here's a simple example to get you started. This example assumes you're using
some bundler like [vite](https://vite.dev/) or
[webpack](https://webpack.js.org/) to manage your app.

Install the official [npm](https://www.npmjs.com/package/@freemius/checkout)
package.

```bash
npm i @freemius/checkout
# If using yarn
yarn add @freemius/checkout
```

In your app, given the HTML:

```html
<select id="licenses">
    <option value="1" selected="selected">Single Site License</option>
    <option value="2">2-Site License</option>
    <option value="unlimited">Unlimited Sites License</option>
</select>
<button id="purchase">Buy Button</button>
```

We can now write the JavaScript code to handle the purchase.

```javascript
import { Checkout } from '@freemius/checkout';

function getSelectedLicenses() {
    return document.querySelector('#licenses').value;
}

const handler = new Checkout({
    product_id: '311',
    public_key: 'pk_a42d2ee6de0b31c389d5d11e36211',
});

document.querySelector('#purchase').addEventListener('click', (e) => {
    e.preventDefault();

    handler.open({
        name: 'My Awesome Plugin',
        licenses: getSelectedLicenses(),
        purchaseCompleted: (response) => {
            console.log('Purchase completed:', response);
        },
        success: (response) => {
            console.log('Checkout closed after successful purchase:', response);
        },
    });
});
```

Please find detailed guides [below](#api).

> **NOTE**: If you're migrating from the old checkout JS, please see the
> [migration guide](#migration-guide).

### Using hosted CDN

To use the hosted CDN, simply include the script tag in your HTML.

```html
<script
    type="text/javascript"
    src="https://checkout.freemius.com/js/v1/"
></script>
```

This will add the global `FS.Checkout` class which you can instantiate.

You can also load the script using the `async` or `defer` attribute on the
script tag. Note, however, that with asynchronous loading any API calls will
have to be made only after the script execution has finished. For that you'll
need to hook into the `load` event of `window` or use `window.onload`.

```html
<script
    type="text/javascript"
    src="https://checkout.freemius.com/js/v1/"
    async
    defer
></script>

<script type="text/javascript">
    window.addEventListener('load', () => {
        const handler = new FS.Checkout({
            product_id: '1234',
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

## API

Both the constructor and the `open` method accept the following set of options.

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

For testing with the sandbox API, see the
[relevant section](#testing-with-sandbox).

### Instantiate the class

The main class exported by the package is `Checkout`. For the hosted CDN it is
available under the global `FS` namespace.

```js
const handler = new FS.Checkout({
    product_id: '1234',
    public_key: 'pk_xxxx',
});
```

If you're using the package from npm, simply import it and create an instance.

```js
import { Checkout } from 'freemius-checkout-js';

// instantiate
const handler = new Checkout({
    product_id: '0001',
    public_key: 'pk_xxxx',
});
```

Note that the `product_id` and `public_key` are required parameters and must be
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

We will make a small react hook. Here we assume the `product_id` and
`public_key` are available in
[some environment variable](https://vite.dev/guide/env-and-mode).

**checkout.ts**

```tsx
import { Checkout, CheckoutOptions } from '@freemius/checkout';
import { useState, useEffect } from 'react';

export const checkoutConfig: CheckoutOptions = {
    product_id: import.meta.env.VITE_FS_PLUGIN_ID as string,
    public_key: import.meta.env.VITE_FS_PUBLIC_KEY as string,
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

## Testing with the Sandbox

This sample code uses PHP to generate the token and timestamp but you can use
the same approach in any server-side environment which will protect the secret
key.

1. Go to the Developer Dashboard.
2. Under Plans click on the "Get Checkout" button.
3. Choose the "Overlay code" option.
4. Go to the Sandbox tab.
5. Copy the code to generate the `sandbox_token` and `timestamp` values and
   output them for the Javascript to use.

Example:

```PHP
<?php
$plugin_id         = 1; // Change to your product ID
$plugin_public_key = 'pk_00001'; // Your public key
$plugin_secret_key = 'sk_00001'; // Your secret key
$timestamp         = time();

$sandbox_token = md5(
    $timestamp .
    $plugin_id .
    $plugin_secret_key .
    $plugin_public_key .
    'checkout'
);
```

```js
const config = {
    // ...
    sandbox: {
        token: '<?php echo $sandbox_token; ?>',
        ctx: '<?php echo $timestamp; ?>',
    },
};
```

**NOTICE**: Use this only during development and never publish the token and
context. In this repository we use the `.env` file for storing sandbox data.

## Migration guide

1. Look for the following scripts:
    ```html
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://checkout.freemius.com/checkout.min.js"></script>
    ```
2. Remove the jQuery script tag if you aren't using jQuery.
3. Replace the checkout script with the new one.
    ```html
    <script src="https://checkout.freemius.com/js/v1/"></script>
    ```
4. Change `FS.Checkout.configure()` to `new FS.Checkout()`:

    ```diff
    - // Legacy checkout code
    - const handler = FS.Checkout.configure({
    + // New checkout code
    + const handler = new FS.Checkout({
        plugin_id: '1234',
        plan_id: '5678',
        public_key: 'pk_ccca7be7fa43aec791448b43c6266',
        image: 'https://your-plugin-site.com/logo-100x100.png',
    });
    ```

The rest of the code will continue to work exactly as it is with no changes.

Optionally you can also change `plugin_id` to `product_id`, but we support both
(giving preference to `product_id` if both are set) and we don't plan to remove
it the near future.

```js
document.querySelector('#purchase').addEventListener('click', (e) => {
    handler.open({
        name: 'My Awesome Plugin',
        licenses: getSelectedLicenses(),
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

Note: If you need to add a checkout for a different configuration on the same
page, just create a new checkout:

```js
const anotherHandler = new FS.Checkout({
    product_id: '4321',
    plan_id: '9876',
    public_key: 'pk_....nnn',
    image: 'https://your-plugin-site.com/logo-100x100.png',
});
```

Now you can add another event listener that opens the new checkout:

```js
document
    .querySelector('#another-purchase-button')
    .addEventListener('click', (e) => {
        anotherHandler.open({
            name: 'My Awesome Plugin',
            licenses: getSelectedLicenses(),
            purchaseCompleted: function (response) {
                //...
            },
            success: function (response) {
                //...
            },
        });

        e.preventDefault();
    });
```

If you've been using the FS.Checkout singleton interface like

```js
FS.Checkout.open({
    plugin_id: 'x',
    // ...
});
```

Then you will need to adjust your code to call the methods on the instance
instead of the singleton.

```js
const handler = new FS.Checkout({
    plugin_id: 'x',
    // ...
});

handler.open({
    // ...
});
```

### Migration adapter (not recommended)

We also have introduced a compatibility layer which you can use as a quick path
to migrate to the new checkout JS without making any changes to your checkout
code.

However, please note the following limitations to this approach:

-   it may stop working in a future version.
-   it has a singleton pattern which can get confusing when configuring for
    multiple products on the same page.
-   using the adapter will add extra bytes.

#### Instructions:

1. Look for the checkout script:
    ```html
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://checkout.freemius.com/checkout.min.js"></script>
    ```
2. Remove the jQuery script tag if you aren't using jQuery.
3. Replace the checkout script with the new one.
    ```html
    <script src="https://checkout.freemius.com/js/v1/legacy/"></script>
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
        licenses: getSelectedLicenses(),
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

## Contributing

We welcome contributions! Please see the
[contribution guide](./CONTRIBUTING.md).
