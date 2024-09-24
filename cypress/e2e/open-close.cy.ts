import { getIframeBody } from '../support/iframe';
import { pages } from '../fixtures/pages';

describe('checkout for basic functionality', () => {
    pages.forEach((page) => {
        it(`can open and close for ${page}`, () => {
            cy.visit(page);

            // Click the button
            cy.get('button#buy').click();

            cy.get('#event-log').contains('afterOpen at');

            // Click a button inside the iFrame
            getIframeBody().contains('Email address');

            getIframeBody().find('button.fs-signal-bar__button--close').click();

            cy.get('#event-log').contains('cancel at');
            cy.get('#event-log').contains('afterClose at');
        });
    });
});
