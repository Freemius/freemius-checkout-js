import { checkA11y } from '../support/a11y';

beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));

    cy.injectAxe();
});

describe('reviews box tests', () => {
    it(`Reviews box exists and there are no errors`, () => {
        // Element with class fs-reviews should exist
        cy.get('.fs-reviews').should('exist');

        checkA11y(cy);
    });
});
