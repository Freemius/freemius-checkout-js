import { getIframeBody } from '../support/iframe';
import { axeTerminalLog, checkA11y } from '../support/a11y';

describe('accessibility tests for overlay', () => {
    it('passes when checkout is loaded', () => {
        cy.visit('/global/');
        cy.injectAxe();

        // Click the button
        cy.get('button#buy').click();

        cy.get('#event-log').contains('afterOpen at');

        getIframeBody().contains('Email address');

        getIframeBody().injectAxe();

        checkA11y(cy);

        getIframeBody().checkA11y(undefined, { iframes: true }, axeTerminalLog);
    });
});
