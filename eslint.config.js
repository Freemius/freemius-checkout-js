import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{rules: {
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
		}},
	eslintConfigPrettier,
];
