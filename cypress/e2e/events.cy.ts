import { getIframeBody } from '../support/iframe';
import { pages } from '../fixtures/pages';

describe('checkout js with postmessage event', () => {
    pages.forEach((page) => {
        it(`passes around all events for ${page}`, () => {
            cy.visit(page);

            // Click the button
            cy.get('button#buy').click();

            cy.get('#event-log').contains('afterOpen at');

            // Expect the iFrame to be visible
            // Click a button inside the iFrame
            getIframeBody()
                .contains('Email address')
                .type('dummy@freemius.com');

            getIframeBody().contains('First name').type('Dummy');

            cy.get('#event-log').contains('track: email-updated at');

            getIframeBody().contains('PayPal').click();

            cy.get('#event-log').contains('track: paypal at');

            getIframeBody()
                .contains('Get unlimited license for an extra')
                .click();

            cy.get('#event-log').contains('track: licenses-inc at');

            getIframeBody()
                .contains('Get a lifetime license for an extra')
                .click();

            cy.get('#event-log').contains('track: billing-cycle-updated at');

            getIframeBody().contains('Card').click();

            cy.get('#event-log').contains('track: cc at');

            getIframeBody().contains('Last name').type('User');

            getIframeBody()
                .contains('Credit or debit card number')
                .type('4242424242424242');
            getIframeBody()
                .contains('Expiry')
                .type(
                    `12${(new Date().getFullYear() + 1).toString().slice(-2)}`
                );
            getIframeBody().contains('Security code').type('123');
            getIframeBody().contains('Zip code').type('12345');

            getIframeBody().contains('Email address').click();
            getIframeBody().contains('First name').click();
            getIframeBody().contains('Last name').click();

            getIframeBody()
                .contains('Confirm email address')
                .type('dummy@freemius.com');

            getIframeBody().contains('Phone number').click();

            getIframeBody().contains('Review Order').click();

            cy.get('#event-log').contains('track: review-order at');
        });
    });
});
