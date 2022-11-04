module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	settings: {
		react: {
			version: 'detect',
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',

		// Make sure this is at last.
		'prettier',
	],

	rules: {
		// react specific rules
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'react/default-props-match-prop-types': 'off',
		'react/no-unused-prop-types': 'off',
		'react/forbid-prop-types': 'off',
		'react/jsx-props-no-spreading': 'off',

		// typescript specific rules
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/prefer-interface': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
		'@typescript-eslint/no-for-in-array': 'off',
		'@typescript-eslint/no-unnecessary-qualifier': 'off',
		'@typescript-eslint/no-unnecessary-type-assertion': 'off',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-explicit-any': 'off',

		// react specific rules
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',

		// other rules
		'no-nested-ternary': 'off',
		eqeqeq: ['error', 'smart'],
		'react/style-prop-object': 'off',
		'no-console': 'warn',
		'prefer-destructuring': 'warn',
	},
};
