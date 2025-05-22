import { viewPorts, checkA11y } from '../support/a11y';

beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));
    cy.injectAxe();
});

describe('accessibility tests for hosted checkout', () => {
    viewPorts.forEach(([width, height]) => {
        it(`passes fs-select with search with viewport ${width} x ${height}`, () => {
            cy.viewport(width, height);

            cy.contains('Country').click();

            checkA11y(cy);

            cy.get('.fs-select__dropdown-search input').type('Uni');

            checkA11y(cy);
        });
    });
});
