function getIframeDocument() {
    return (
        cy
            .get('iframe[data-testid]')
            // Cypress yields jQuery element, which has the real
            // DOM element under property "0".
            // From the real DOM iframe element we can get
            // the "document" element, it is stored in "contentDocument" property
            // Cypress "its" command can access deep properties using dot notation
            // https://on.cypress.io/its
            .its('0.contentDocument')
            .should('exist')
            .then((doc) => {
                return cy
                    .wrap(doc)
                    .its('readyState')
                    .should('eq', 'complete')
                    .then(() => cy.wrap(doc));
            })
    );
}

export function getIframeBody() {
    // get the document
    return (
        getIframeDocument()
            // automatically retries until body is loaded
            .find('body')
            .should('exist')
            // wraps "body" DOM element to allow
            // chaining more Cypress commands, like ".find(...)"
            .then(cy.wrap)
    );
}
