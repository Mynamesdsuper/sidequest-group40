// ESLint flat config: typescript-eslint recommended + Prettier compatibility + the module-boundaries rule.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import moduleBoundaries from './eslint-rules/module-boundaries.js';

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Application code only: tests may compare with the real time.
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: 'Use the shared Clock (shared/clock), never Date.now() (ADR 0003).',
        },
      ],
    },
  },
  {
    files: ['src/modules/**/*.ts'],
    plugins: { local: { rules: { 'module-boundaries': moduleBoundaries } } },
    rules: { 'local/module-boundaries': 'error' },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { require: 'readonly', module: 'writable', __dirname: 'readonly' } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  prettier,
);
