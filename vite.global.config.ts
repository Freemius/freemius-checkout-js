import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'lib/global',
        target: 'es2015',
        lib: {
            entry: resolve(__dirname, './src/global.ts'),
            formats: ['iife'],
            // @note - The build will not expose this variable because the file itself doesn't export anything, but we just need to give it a name anyway for the tooling.
            name: '__FSCheckoutGlobalInternal__',
            fileName: () => `checkout.js`,
        },
    },
});
