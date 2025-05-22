import { viewPorts, checkA11y } from '../support/a11y';

beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));
    cy.injectAxe();
});

describe('accessibility tests for hosted checkout', () => {
    viewPorts.forEach(([width, height]) => {
        it(`passes golden flow under viewport ${width} x ${height}`, () => {
            cy.viewport(width, height);

            cy.contains('Email address').should('exist');

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

            cy.contains('Pay & Subscribe').click();

            cy.wait(100);

            cy.contains('Subscription was successful').should('exist');

            checkA11y(cy);
        });
    });
});
