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
-   [Testing with Sandbox](#testing-with-sandbox)
-   [Migration guide](#migration-guide)
-   [Contributing](#contributing)

## Usage Guide

Here's a simple example to get you started.

Install the official
[npm](https://www.npmjs.com/package/@freemius/checkout) package.

```bash
npm i @freemius/checkout
# If using yarn
yarn add @freemius/checkout
```

```html
<select id="licenses">
    <option value="1" selected="selected">Single Site License</option>
    <option value="2">2-Site License</option>
    <option value="unlimited">Unlimited Sites License</option>
</select>
<button id="purchase">Buy Button</button>

<script type="module">
import { Checkout } from '@freemius/checkout';

const handler = new Checkout({
    plugin_id: '9885',
    plan_id: '16634',
    public_key: 'pk_ccca7be7fa43aec791448b43c6266',
    image: 'https://your-plugin-site.com/logo-100x100.png',
});

document.querySelector('#purchase').addEventListener('click', (e) => {
    e.preventDefault();
    
    handler.open({
        name: 'My Awesome Plugin',
        licenses: document.querySelector('#licenses').value,
        purchaseCompleted: (response) => {
            // The logic here will be executed immediately after the purchase confirmation.
            // console.log(response.user.email);
        },
        success: (response) => {
            // The logic here will be executed after the customer closes the checkout, after a successful purchase.
            // console.log(response.user.email);
        },
    });
});
</script>
```

Please find detailed guides below.

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

For testing with the sandbox API, see the [relevant section](#testing-with-sandbox).

### Instantiate the class

The main class exported by the package is `Checkout`. For the hosted CDN it is
available under the global `FS` namespace.

```js
const handler = new FS.Checkout({
    plugin_id: '1234',
    public_key: 'pk_xxxx',
});
```

If you're using the package from npm, simply import it and create an
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

## Testing with the Sandbox

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

```js
// Legacy checkout code
const handler = FS.Checkout.configure({
    plugin_id: '1234',
    plan_id: '5678',
    public_key: 'pk_ccca7be7fa43aec791448b43c6266',
    image: 'https://your-plugin-site.com/logo-100x100.png',
});
```

```js
// New checkout code
const handler = new FS.Checkout({
    plugin_id: '1234',
    plan_id: '5678',
    public_key: 'pk_ccca7be7fa43aec791448b43c6266',
    image: 'https://your-plugin-site.com/logo-100x100.png',
});
```

The rest of the code will continue to work exactly as it is with no changes.

```js
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
Note: If you need to add a checkout for a different configuration on the same page, just create a new checkout:

```js
const anotherHandler = new FS.Checkout({
    plugin_id: '4321',
    plan_id: '9876',
    public_key: 'pk_....nnn',
    image: 'https://your-plugin-site.com/logo-100x100.png',
});
```

Now you can add another event listener that opens the new checkout:

```js
document.querySelector('#another-purchase-button').addEventListener('click', (e) => {
    anotherHandler.open({
        name: 'My Awesome Plugin',
        licenses: document.querySelector('#licenses').value,
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


### Migration adapter (not recommended)
We also have introduced a compatibility layer which you can use
to migrate to the new checkout JS without making any changes to your checkout code.

In your code, look for the checkout script:

```html
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://checkout.freemius.com/checkout.min.js"></script>
```

1. Remove the jQuery script tag if you aren't using jQuery.
2. Replace the checkout script with the new one.

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
migration and it may stop working in a future version. Addiitonally, with the 
legacy script it's not possible to open two different checkouts on the page. 
Every time `configure` is called the original option will be overridden.

## Contributing

We welcome contributions! Please see the
[contribution guide](./CONTRIBUTING.md).
