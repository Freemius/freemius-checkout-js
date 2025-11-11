import { getIframeBody } from '../support/iframe';
import { pages } from '../fixtures/pages';

describe('dunning auto trigger', () => {
    pages.forEach((page) => {
        it(`opens the dunning checkout for ${page}`, () => {
            cy.visit(
                `${page}?_fs_product_id=${Cypress.env('DUNNING_PRODUCT_ID')}&_fs_dunning=1&_fs_testing=1`
            );

            getIframeBody().contains(
                'Please update your payment information to keep your account active'
            );
        });
    });
});
