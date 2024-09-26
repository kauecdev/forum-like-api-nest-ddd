import path from 'node:path'
import url from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

export default [
  ...new FlatCompat({
    baseDirectory: path.dirname(url.fileURLToPath(import.meta.url)),
  }).config({
    ignorePatterns: ['node_modules', 'dist'],
    env: {
      es2021: true,
      node: true,
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
          endOfLine: 'auto',
        },
      ],
    },
    settings: {
      'import/parsers': {
        [import('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
      },
    },
  }),
]
