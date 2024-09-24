import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        setupNodeEvents() {
            // implement node event listeners here
        },
        baseUrl: 'http://localhost:5173/cypress/pages/',
        chromeWebSecurity: false,
    },
    defaultCommandTimeout: 20000,
});
