import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createConfig } from './src/lib/utils/vite';

export default defineConfig(
    createConfig(resolve(__dirname, './src/adapter.ts'), 'adapter', __dirname)
);
