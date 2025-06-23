beforeEach(() => {
    cy.visit(Cypress.env('A11Y_CHECKOUT_URL'));
});

describe('header hierarchy tests', () => {
    it(`Reviews box contains no H3 tag`, () => {
        // Element with class fs-reviews should exist
        cy.get('.fs-reviews').should('exist');

        // Element .fs-reviews does not have any H3 tags inside it
        cy.get('.fs-reviews')
            .first()
            .within(() => {
                cy.get('h3').should('not.exist');
            });
    });

    it('should have header tags in a logical order', () => {
        // In general, header tags should be in a logical order
        cy.get('h1').should('have.length', 1);

        cy.get('body')
            .find('h1, h2, h3, h4, h5, h6')
            .then(($headings) => {
                const headingTags = $headings
                    .map((_index, el) => el.tagName.toLowerCase())
                    .get();

                let currentMaxLevel = 0; // Represents the highest heading level encountered so far (h1=1, h2=2, etc.)

                headingTags.forEach((tag) => {
                    const level = parseInt(tag.replace('h', ''));

                    // If it is the first heading, set the maximum level.
                    if (currentMaxLevel === 0) {
                        currentMaxLevel = level;
                    } else {
                        // A lower-level heading (e.g., h3) cannot appear before a higher-level heading (e.g. h2)
                        // Unless there has been a "reset" due to a higher-level heading starting a new block.
                        // In this test, we are checking that the level is not *too* much higher than the previous one.
                        // We allow a jump of one level (h2 after h1, h3 after h2) or a jump back to a higher level
                        // (h2 after h3, but only if higher-level headings have appeared before).
                        // The logic here is that the current level cannot be greater than the highest level encountered + 1.
                        // E.g., If the last was h2 (level 2), the next can be h2 or h3. Not h4, unless h3 is present.
                        if (level > currentMaxLevel + 1) {
                            throw new Error(
                                `Heading tag hierarchy isn't respected: <${tag}> appears after a <${$headings[headingTags.indexOf(tag) - 1].tagName.toLowerCase()}> without an intermediate level.\n` +
                                    `Error on element: <${tag}> with text "${$headings[headingTags.indexOf(tag)].textContent?.trim()}"\n` +
                                    `Previous element: <${$headings[headingTags.indexOf(tag) - 1].tagName.toLowerCase()}> with text "${$headings[headingTags.indexOf(tag) - 1]?.textContent?.trim()}"`
                            );
                        }
                        currentMaxLevel = level;
                    }
                });
            });
    });
});
