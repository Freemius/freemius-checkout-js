import { checkA11y, viewPorts } from '../support/a11y';

beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));

    cy.injectAxe();
});

describe('reviews box tests', () => {
    viewPorts.forEach(([width, height]) => {
        it(`Reviews box exists and there are no errors with viewport ${width}  x ${height}`, () => {
            cy.viewport(width, height);
            // Social proofing elements (review & money back guarantee) should be visible
            cy.get('.fs-reviews').should('exist');
            cy.get('.fs-money-back-guarantee').should('exist');

            checkA11y(cy);
        });
    });
});
