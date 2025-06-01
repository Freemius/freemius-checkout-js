import { defineConfig } from 'cypress';
import dotenvPlugin from 'cypress-dotenv';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },
                table(message) {
                    console.table(message);

                    return null;
                },
            });

            return dotenvPlugin(config, {
                path: [
                    '.env.development.local',
                    '.env.production.local',
                    '.env',
                ],
            });
        },
        baseUrl: 'http://localhost:5173/cypress/pages/',
        chromeWebSecurity: false,
    },
    defaultCommandTimeout: 20000,
});
