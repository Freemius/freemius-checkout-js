import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        target: 'es2020',
        outDir: 'lib/module',
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: 'checkout',
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            exclude: ['tests'],
        }),
    ],
});
