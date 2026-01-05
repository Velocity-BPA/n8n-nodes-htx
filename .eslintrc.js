module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
		'prettier',
	],
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
	ignorePatterns: ['dist/**', 'node_modules/**', '*.js', '!.eslintrc.js'],
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
		'n8n-nodes-base/node-param-description-missing-final-period': 'off',
		'n8n-nodes-base/node-param-description-missing-from-dynamic-options': 'off',
		'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
		'no-console': 'warn',
		'prefer-const': 'error',
		'no-var': 'error',
	},
	overrides: [
		{
			files: ['test/**/*.ts'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
};
