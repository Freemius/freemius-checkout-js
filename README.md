# FREEMIUS CHECKOUT JAVASCRIPT SDK

[![npm version](https://badge.fury.io/js/@freemius%2Fcheckout.svg)](https://badge.fury.io/js/@freemius%2Fcheckout)
![NPM Downloads](https://img.shields.io/npm/dw/@freemius/checkout)
[![Twitter](https://img.shields.io/twitter/follow/freemius.svg?style=social&label=@freemius)](https://twitter.com/freemius)

A modern, API-driven, JavaScript-based
[checkout app for Freemius sellers](https://freemius.com/help/documentation/checkout/)
.

![Freemium Checkout app screenshot](freemius-overlay-checkout.png?raw=true)

## Usage Guide

The Freemius Checkout JS SDK is available both in a
[CDN version and as an npm package](https://freemius.com/help/documentation/saas-sdk/checkout-js-sdk/installation/).
This guide covers usage via the npm package. We assume you already have a
bundler like [vite](https://vite.dev/) or [webpack](https://webpack.js.org/) to
manage your app.

1. Install the official [npm](https://www.npmjs.com/package/@freemius/checkout)
   package.

    ```bash
    npm i @freemius/checkout

    # If using yarn
    yarn add @freemius/checkout
    ```

2. Add the given HTML to your app:

    ```html
    <select id="licenses">
        <option value="1" selected="selected">Single Activation License</option>
        <option value="2">2-Activations License</option>
        <option value="unlimited">Unlimited Activations License</option>
    </select>
    <button id="purchase">Buy Button</button>
    ```

3. Add the JavaScript code to handle the purchase:

    ```javascript
    import { Checkout } from '@freemius/checkout';

    // Instantiate the Checkout
    const handler = new Checkout({
        product_id: '123456',
    });

    document.querySelector('#purchase').addEventListener('click', (e) => {
        e.preventDefault();

        handler.open({
            name: 'My Awesome Product',
            licenses: getSelectedLicenses(),
            purchaseCompleted: (response) => {
                console.log('Purchase completed:', response);
            },
            success: (response) => {
                console.log(
                    'Checkout closed after successful purchase:',
                    response
                );
            },
        });
    });

    function getSelectedLicenses() {
        return document.querySelector('#licenses').value;
    }
    ```

To learn more about the CDN, checkout API and its usage, visit the
[Freemius Docs](https://freemius.com/help/documentation/checkout/saas-sdk/checkout-js-sdk/).

## Contributing

This project is open source, and we welcome contributions. See the
[contribution guide](./CONTRIBUTING.md).
