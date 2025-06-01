import { viewPorts, checkA11y } from '../support/a11y';

beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));
    cy.injectAxe();
});

describe('accessibility tests for hosted checkout', () => {
    viewPorts.forEach(([width, height]) => {
        it(`passes with form error with viewport ${width} x ${height}`, () => {
            cy.viewport(width, height);

            cy.contains('Email address').click();
            cy.contains('First name').click();
            cy.contains('Last name').click();
            cy.contains('Credit or debit card number').click();
            cy.contains('Expiry').click();
            cy.contains('Security code').click();

            cy.contains('Review Order').click();

            cy.contains('Required').should('exist');

            checkA11y(cy);

            cy.contains('Email address').type('swas@freemius.com');
            cy.contains('First name').type('Swas');
            cy.contains('Last name').type('Ghosh');
            cy.contains('Confirm email address').type('swas@freemius.com');

            cy.wait(100);

            cy.contains('Review Order').click();

            cy.wait(100);

            checkA11y(cy);
        });
    });
});
