const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('vite');

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/lib/checkout.ts'),
			name: 'FSCheckout',
			fileName: format => `fs-checkout.${format}.js`,
		},
	},
});
