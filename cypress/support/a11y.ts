export function axeTerminalLog(violations: any) {
    cy.task(
        'log',
        `${violations.length} accessibility violation${
            violations.length === 1 ? '' : 's'
        } ${violations.length === 1 ? 'was' : 'were'} detected`
    );
    // pluck specific keys to keep the table readable
    const violationData = violations.map(
        ({ id, impact, description, nodes }: any) => ({
            id,
            impact,
            description,
            nodes: nodes.length,
            html: nodes.map((node: any) => node.html),
            target: nodes.map((node: any) => node.target),
            failureSummary: nodes.map((node: any) => node.failureSummary),
        })
    );

    cy.task('table', violationData);
}

export const viewPorts = [
    [1280, 800],
    [375, 667],
];

export function checkA11y(cy: Cypress.cy) {
    cy.checkA11y(
        undefined,
        {
            iframes: true,
        },
        axeTerminalLog
    );
}
