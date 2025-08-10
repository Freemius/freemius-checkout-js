import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'unplugin-dts/vite';
import { minifyInlineCSS } from './src/lib/utils/vite';

export default defineConfig({
    build: {
        target: 'es2020',
        outDir: 'lib/module',
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: 'checkout',
        },
        sourcemap: false,
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            exclude: ['tests'],
            bundleTypes: true,
            clearPureImport: false,
        }),
        minifyInlineCSS,
    ],
});
