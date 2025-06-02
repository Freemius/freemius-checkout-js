import { viewPorts, checkA11y } from '../support/a11y';

beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));
    cy.injectAxe();
});

describe('accessibility tests for hosted checkout', () => {
    viewPorts.forEach(([width, height]) => {
        it(`tooltip passes accessibility test with viewport ${width} x ${height}`, () => {
            cy.viewport(width, height);

            cy.get('.vat-tooltip__trigger')
                .closest('.fs-tooltip__trigger')
                .focus();

            cy.contains('Tax is calculated').should('exist');

            checkA11y(cy);
        });
    });
});
