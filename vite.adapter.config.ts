import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'lib/adapter',
        target: 'es2015',
        lib: {
            entry: resolve(__dirname, './src/adapter.ts'),
            formats: ['iife'],
            // @note - The build will not expose this variable because the file itself doesn't export anything, but we just need to give it a name anyway for the tooling.
            name: '__FSCheckoutAdapterInternal__',
            fileName: () => `checkout.js`,
        },
    },
});
