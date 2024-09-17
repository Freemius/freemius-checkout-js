import { PluginOption, UserConfig } from 'vite';
import { dirname, resolve } from 'path';

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

export function createConfig(
    entry: string,
    outDir: string,
    sourceRootDir: string
): UserConfig {
    const iifeName = outDir.charAt(0).toUpperCase() + outDir.slice(1);

    return {
        build: {
            outDir: `lib/${outDir}`,
            target: 'es2015',
            lib: {
                entry,
                formats: ['iife'],
                // @note - The build will not expose this variable because the file itself doesn't export anything, but we just need to give it a name anyway for the tooling.
                name: `__FSCheckout${iifeName}Internal__`,
                fileName: () => `checkout.${outDir}.js`,
            },
            sourcemap: true,
            rollupOptions: {
                output: {
                    sourcemapPathTransform(relativeSourcePath, sourcemapPath) {
                        // Make it start from the root.
                        return resolve(
                            dirname(sourcemapPath),
                            relativeSourcePath
                        )
                            .replace(sourceRootDir, '')
                            .replace('/src/', '/fs-checkout/');
                    },
                },
            },
        },
        plugins: [minifyInlineCSS],
    };
}
