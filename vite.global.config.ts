import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createConfig } from './src/lib/utils/vite';

export default defineConfig(
    createConfig(resolve(__dirname, './src/global.ts'), 'global', __dirname)
);
