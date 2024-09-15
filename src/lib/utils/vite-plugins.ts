import { PluginOption } from 'vite';

export const minifyInlineCSS: PluginOption = {
    name: 'fs-minify-inline-css',
    transform(code, id) {
        // We are only minifying TypeScript and JavaScript files.
        if (!/\.(ts|js)$/.test(id)) {
            return null;
        }

        // Regex to match CSS inside template literals starting with `/*@fs-css-minify*/`.
        const cssRegex = /\/\*@fs-css-minify\*\/\s*`([^`]+)`/g;

        // Check if the code contains any CSS to minify.
        if (cssRegex.test(code)) {
            // Replace all the CSS inside template literals with minified CSS.
            code = code.replace(cssRegex, (_, css) => {
                // Just remove the new lines and spaces.
                css = css.replace(/\s+/g, ' ').trim();

                // Return the minified CSS inside a template literal.
                return `\`${css}\``;
            });
        }

        return {
            code,
            map: null,
        };
    },
};
