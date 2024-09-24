import { getIframeBody } from '../support/iframe';
import { pages } from '../fixtures/pages';

describe('checkout for purchase', () => {
    pages.forEach((page) => {
        it(`can purchase for ${page}`, () => {
            cy.visit(page);

            // Click the button
            cy.get('button#buy').click();

            cy.get('#event-log').contains('afterOpen at');

            // Just do a sandbox purchase with the sandbox button.
            getIframeBody()
                .contains('🐞 Prefill Form (Only visible in Sandbox mode)')
                .click();

            cy.wait(100);

            getIframeBody().contains('Review Order').click();

            getIframeBody().contains('Pay & Subscribe').click();

            cy.wait(100);

            cy.get('#event-log').contains('purchaseCompleted at');

            getIframeBody().contains('Got it').click();

            cy.get('#event-log').contains('success at');
            cy.get('#event-log').contains('afterClose at');
        });
    });
});
