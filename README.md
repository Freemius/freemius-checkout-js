# FREEMIUS CHECKOUT JAVASCRIPT CLIENT

Freemius Checkout JS, without jQuery or other dependencies, written in
TypeScript as ES Modules.

**Why?**

The JavaScript library Freemius provides depends on jQuery. This works good if
your website already has dependency on jQuery, but becomes a liability
otherwise.

Also the official checkout js supports older IE versions, which aren't needed
anymore (at-least for my own use-case).

So I started developing this lightweight JS library which would

1. Support all original APIs from the official JS library.
2. Work on all evergreen browsers.
3. Be tiny (less than 4KB gzipped) in size.

## Installation

The recommended way to install is through
[npm](https://www.npmjs.com/package/freemius-checkout-js).

```bash
npm i freemius-checkout-js
# If using yarn
yarn add freemius-checkout-js
```

## Quick Usage

```js
import { FSCheckout } from 'freemius-checkout-js';

// instantiate
const fsCheckout = new FSCheckout({
	plugin_id: 0001,
	public_key: 'pk_xxxx',
});

// Call the API
document.querySelector('#mybutton').addEventListener('click', e => {
	e.preventDefault();
	// call the open method
	fsCheckout.open({
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

```ts
export interface CheckoutOptions {
	/**
	 * Required product ID (whether it’s a plugin, theme, add-on, bundle, or SaaS).
	 */
	plugin_id: number;
	/**
	 * Require product public key.
	 */
	public_key: string;
	/**
	 * An optional ID to set the id attribute of the checkout’s <body> HTML element.
	 * This argument is particularly useful if you have multiple checkout instances
	 * that need to have a slightly different design or visibility of UI components.
	 * You can assign a unique ID for each instance and customize it differently
	 * using the CSS stylesheet that you can attach through the
	 * PLANS -> CUSTOMIZATION in the Developer Dashboard.
	 */
	id?: string;
	/**
	 * An optional string to override the product’s title.
	 *
	 * @default "Defaults to the product’s title set within the Freemius dashboard."
	 */
	name?: string;
	/**
	 * An optional string to override the checkout’s title when buying a new license.
	 *
	 * @default "Great selection, {{ firstName }}!"
	 */
	title?: string;
	/**
	 * An optional string to override the checkout’s subtitle.
	 *
	 * @default "You’re one step closer to our {{ planTitle }} features"
	 */
	subtitle?: string;
	/**
	 * An optional icon that loads at the checkout and will override the product’s
	 * icon uploaded to the Freemius Dashboard. Use a secure path to the image
	 * over HTTPS. While the checkout will remain PCI compliant,
	 * credit-card automatic prefill by the browser will not work.
	 *
	 * @default "product's image set within the Freemius dashboard"
	 */
	image?: string;
	/**
	 * The ID of the plan that will load with the checkout. When selling multiple
	 * plans you can set the param when calling the open() method.
	 *
	 * @default "1st paid plan"
	 */
	plan_id?: number;
	/**
	 * A multi-site licenses prices that will load immediately with the checkout.
	 * A developer-friendly param that can be used instead of the pricing_id.
	 * To specify unlimited licenses prices, use one of the following
	 * values: 0, null, or 'unlimited'.
	 *
	 * @default 1
	 */
	licenses?: number;
	/**
	 * Set this param to true if you like to disable the licenses selector when
	 * the product is sold with multiple license activation options.
	 *
	 * @default false
	 */
	disable_licenses_selector?: boolean;
	/**
	 * Use the `licenses` param instead. An optional ID of the exact multi-site
	 * license prices that will load once the checkout opened.
	 *
	 * @default "plan’s single-site prices ID"
	 */
	pricing_id?: number;
	/**
	 * An optional billing cycle that will be auto selected when the checkout is opened.
	 * Can be one of the following values: 'monthly', 'annual', 'lifetime'.
	 *
	 * @default 'annual'
	 */
	billing_cycle?: 'monthly' | 'annual' | 'lifetime';
	/**
	 * Set this param to `true` if you like to hide the billing cycles selector
	 * when the product is sold in multiple billing frequencies.
	 *
	 * @default false
	 */
	hide_billing_cycles?: boolean;
	/**
	 * One of the following 3-chars currency codes (ISO 4217): 'usd', 'eur', 'gbp'.
	 *
	 * @default 'usd'
	 */
	currency?: 'usd' | 'eur' | 'gbp';
	/**
	 * An optional coupon code to be automatically applied on the checkout
	 * immediately when opened.
	 */
	coupon?: string;
	/**
	 * Set this param to true if you pre-populate a coupon and like to hide the
	 * coupon code and coupon input field from the user.
	 *
	 * @default false
	 */
	hide_coupon?: boolean;
	/**
	 * Set this param to false when selling a bundle and you want the discounts
	 * to be based on the closest licenses quota and billing cycle from the child
	 * products. Unlike the default discounts calculation which is maximized by
	 * basing the discounts on the child products single-site prices.
	 *
	 * @default true
	 */
	maximize_discounts?: boolean;
	/**
	 * When set to true, it will open the checkout in a trial mode and the trial
	 * type (free vs. paid) will be based on the plan’s configuration. This will
	 * only work if you’ve activated the Free Trial functionality in the plan
	 * configuration. If you configured the plan to support a trial that doesn’t
	 * require a payment method, you can also open the checkout in a trial mode
	 * that requires a payment method by setting the value to 'paid'.
	 *
	 * @default false
	 */
	trial?: boolean | 'free' | 'paid';
	/**
	 * An optional param to pre-populate a license key for license renewal,
	 * license extension and more.
	 */
	license_key?: string;
	/**
	 * An optional param to load the checkout for a payment method update.
	 * When set to `true`, the license_key param must be set and associated with
	 * a non-canceled subscription.
	 *
	 * @default false
	 */
	is_payment_method_update?: boolean;
	/**
	 * An optional string to prefill the buyer’s email address.
	 */
	user_email?: string;
	/**
	 * An optional string to prefill the buyer’s first name.
	 */
	user_firstname?: string;
	/**
	 * An optional string to prefill the buyer’s last name.
	 */
	user_lastname?: string;
	/**
	 * An optional user ID to associate purchases generated through the checkout
	 * with their affiliate account.
	 */
	affiliate_user_id?: number;
	// SANDBOX
	/**
	 * If you would like the dialog to open in sandbox mode,
	 */
	sandbox?: {
		ctx: string;
		token: string;
	};
	// EVENT HANDLERS
	/**
	 * A callback handler that will execute once a user closes the checkout by
	 * clicking the close icon. This handler only executes when the checkout is
	 * running in a dialog mode.
	 */
	cancel?: () => void;
	/**
	 * An after successful purchase/subscription completion callback handler.
	 *
	 * Notice: When the user subscribes to a recurring billing plan, this method
	 * will execute upon a successful subscription creation. It doesn’t guarantee
	 * that the subscription’s initial payment was processed successfully as well.
	 */
	purchaseCompleted?: (data: Record<string, any> | null) => void;
	/**
	 * An optional callback handler, similar to purchaseCompleted. The main
	 * difference is that this callback will only execute after the user clicks
	 * the “Got It”” button that appears in the after purchase screen as a
	 * declaration that they successfully received the after purchase email.
	 * This callback is obsolete when the checkout is running in a 'dashboard' mode
	 */
	success?: (
		data: { purchase: Record<string, any> } | Record<string, any> | null
	) => void;
	/**
	 * An optional callback handler for advanced tracking, which will be called on
	 * multiple checkout events such as updates in the currency, billing cycle,
	 * licenses #, etc.
	 */
	track?: (event: string, data: Record<string, any> | null) => void;
	/**
	 * Optional callback to execute when the iFrame opens.
	 */
	afterOpen?: () => void;
	/**
	 * An optional callback to execute when the iFrame closes.
	 */
	afterClose?: () => void;
	/**
	 * Optional callback to trigger on exit intent. This is called only when the
	 * checkout iFrame is shown, not on global exit intent.
	 */
	onExitIntent?: () => void;
}
```

As you can see, all the
[official options](https://freemius.com/help/documentation/selling-with-freemius/freemius-checkout-buy-button/)
are supported here, along with some additional options. For testing with sandbox
API, see the [relevant section](#testing-with-sandbox).

### Instantiate the class

The main class exported by the package is `FSCheckout`. You simply import it and
create an instance.

```js
import { FSCheckout } from 'freemius-checkout-js';

// instantiate
const fsCheckout = new FSCheckout({
	plugin_id: 0001,
	public_key: 'pk_xxxx',
});
```

Note that the `plugin_id` and `public_key` are required parameters and must be
supplied during instantiation.

### Calling the method

Now you can simply call the `open` method to show the checkout popup.

```js
fsCheckout.open();
```

You can also pass additional options

```js
fsCheckout.open({
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

See the
[source code of the demo](https://github.com/swashata/freemius-checkout-js/blob/main/src/main.ts)
to learn more.

To close the popup programmatically, call the `close` method.

```js
fsCheckout.close();
```

## Using without NPM

Use the unpkg CDN or download the file.

```html
<script
	src="https://unpkg.com/freemius-checkout-js@0.0.2/lib/checkout.global.js"
	type="text/javascript"
></script>
```

Now in your document, the library will be available under `FSCheckout` global
variable.

```js
const fsCheckout = new FSCheckout.FSCheckout({
	plugin_id: 0001,
	public_key: 'pk_xxxx',
});
fsCheckout.open({
	// plan
	plan_id: 9999,
	// number of sites
	licenses: 1,
	// billing cycles
	billing_cycle: 'annual',
});
```

**NOTE**: The class is available under `FSCheckout.FSCheckout`.

## Use with React

We will make a small react hook. Here we assume the `plugin_id` and `public_key`
are available in
[some environment variable](https://create-react-app.dev/docs/adding-custom-environment-variables/).

**checkout.ts**

```tsx
import { FSCheckout, CheckoutOptions } from 'freemius-checkout-js';
import { useState, useEffect } from 'react';
export const checkoutConfig: CheckoutOptions = {
	plugin_id: process.env.REACT_APP_PLUGIN_ID as string,
	public_key: process.env.REACT_APP_PUBLIC_KEY as string,
};
export function useFsCheckout() {
	// create a FSCheckout instance once
	const [fsCheckout] = useState<FSCheckout>(
		() => new FSCheckout(checkoutConfig)
	);
	useEffect(() => {
		// close and destroy the DOM related stuff on unmount
		return () => {
			fsCheckout.close();
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
import { useFsCheckout } from './checkout.ts';

export default function App() {
	const fsCheckout = useFsCheckout();

	return (
		<button
			onClick={e => {
				e.preventDefault();
				fsCheckout.open({
					plan_id: 1234,
					licenses: 1,
					billing_cycle: 'annual',
					success: data => {
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

## Setup Local Development Environment

Close the repository. Copy `.env.sample` to `.env.local` and enter plugin id and
public key as specified in the file. Run the command

```bash
yarn dev
```

and it should spin up the server. Make sure to change the ID of plans in the
`.env.local` file. See
[vite documentation](https://vitejs.dev/guide/env-and-mode.html#env-files) to
learn about how `.env` files are handled.

## Testing with Sandbox

To get the sandbox token and ctx, follow the steps:

1. Make sure you are running the development mode of freemius with secret key in
   your local instance.
1. Go to the Upgrade page of your freemius plugin (make sure you are running the
   free version so you have access to the upgrade page.)
1. Click to upgrade to any plan. The goal is to access the checkout page from
   WordPress Admin.
1. Now view page source and search for the word `sandbox`.
1. You should find something like this string
   `sandbox=xxxxxxxx&s_ctx_ts=00000000`.

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

## DISCLAIMER

This project is not directly associated with [Freemius](https://freemius.com/).
I needed a JavaScript library for the checkout without jQuery dependency, hence
I made this. This is used in my website [WPEForm.io](https://www.wpeform.io)
which is a No-Code WordPress Form Builder plugin.
