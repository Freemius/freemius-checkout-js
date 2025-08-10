import { Checkout, postman, Logger, restoreDunningIfPresent } from '.';

window.FS = window.FS || {};

window.FS.Checkout = Checkout;
window.FS.postman = postman;
window.FS.Logger = Logger;

restoreDunningIfPresent(window.FS.paymentMethodUpdateEvents);

// @note - This export is needed so that vite library compiler wraps the code in a function (iife)
export { Checkout };
