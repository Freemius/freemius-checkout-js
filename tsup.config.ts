import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/checkout.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'FSCheckout',
  dts: true,
  minify: true,
  outDir: 'lib',
});
