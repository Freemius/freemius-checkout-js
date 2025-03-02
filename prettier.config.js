/**
 * Copyright (c) 2022 Freemius Inc.
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export default {
    useTabs: false,
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    proseWrap: 'always',
    overrides: [
        {
            files: '*package{-lock,}.json',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
