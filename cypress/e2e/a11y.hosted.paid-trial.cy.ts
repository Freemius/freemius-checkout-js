import { viewPorts, checkA11y } from '../support/a11y';

beforeEach(() => {
    const url = new URL(Cypress.env('A11Y_CHECKOUT_URL'));
    url.searchParams.append('trial', 'paid');

    cy.visit(url.toString());
    cy.injectAxe();
});

describe('accessibility tests for hosted checkout', () => {
    viewPorts.forEach(([width, height]) => {
        it(`passes paid trial with viewport ${width} x ${height}`, () => {
            cy.viewport(width, height);

            checkA11y(cy);

            cy.contains(
                '🐞 Prefill Form (Only visible in Sandbox mode)'
            ).click();

            cy.wait(100);

            checkA11y(cy);

            cy.contains('sales tax applied').should('exist');

            cy.wait(100);

            cy.contains('Review Order').click();

            cy.wait(300);

            checkA11y(cy);
        });
    });
});
