import type { Options } from 'tsup';

export const tsup: Options = {
	entryPoints: ['src/lib/checkout.ts'],
	format: ['esm', 'cjs', 'iife'],
	globalName: 'FSCheckout',
	dts: true,
	minify: false,
	outDir: 'lib',
};
