import { viewPorts, checkA11y } from '../support/a11y';

beforeEach(() => {
    const url = new URL(Cypress.env('A11Y_CHECKOUT_URL'));
    url.searchParams.append('trial', 'free');

    cy.visit(url.toString());
    cy.injectAxe();
});

describe('accessibility tests for hosted checkout', () => {
    viewPorts.forEach(([width, height]) => {
        it(`passes paid trial with viewport ${width} x ${height}`, () => {
            cy.viewport(width, height);

            checkA11y(cy);
        });
    });
});
