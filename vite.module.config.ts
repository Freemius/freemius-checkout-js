import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: 'lib',
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
