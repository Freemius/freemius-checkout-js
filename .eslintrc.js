const path = require('path');

module.exports = {
	extends: ['@wpackio/eslint-config/ts'],
	parserOptions: {
		// project: './tsconfig.json',
		// to speed ESLint
		project: undefined,
		tsconfigRootDir: __dirname,
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: __dirname,
			},
		},
	},
	rules: {
		'no-unused-vars': 'off',
		'babel/camelcase': 'off',
		'no-nested-ternary': 'off',
		eqeqeq: ['error', 'smart'],
		'no-console': 'off',
		'no-undef': 'off',
		'prefer-destructuring': 'off',
		'func-names': 'off',
		'lines-between-class-members': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/prefer-interface': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
		'@typescript-eslint/no-for-in-array': 'off',
		'@typescript-eslint/no-unnecessary-qualifier': 'off',
		'@typescript-eslint/no-unnecessary-type-assertion': 'off',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'no-param-reassign': 'off',
		'no-unneeded-ternary': 'off',
		'operator-assignment': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
				json: 'always',
			},
		],
	},
	overrides: [
		{
			files: [
				'**/*.test.+(tsx|ts)',
				'**/__tests__/**/*.+(tsx|ts)',
				'**/test-utils/**',
			],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
};
