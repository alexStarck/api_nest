// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

const sortDestructure = (await import('eslint-plugin-sort-destructure-keys'))
    .default;
const simpleImportSort = (await import('eslint-plugin-simple-import-sort'))
    .default;
const importPlugin = (await import('eslint-plugin-import')).default;
const prettier = (await import('eslint-plugin-prettier')).default;

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: { js },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
        },
        plugins: {
            'sort-destructure-keys': sortDestructure,
            'simple-import-sort': simpleImportSort,
            import: importPlugin,
            prettier: prettier,
        },
        rules: {
            'sort-destructure-keys/sort-destructure-keys': [
                'error',
                {
                    caseSensitive: false,
                },
            ],
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    singleQuote: true,
                    tabWidth: 4,
                    printWidth: 80,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    bracketSameLine: false,
                    arrowParens: 'avoid',
                    semi: true,
                    importOrderParserPlugins: [
                        'typescript',
                        'classProperties',
                        'decorators-legacy',
                    ],
                    importOrderCaseInsensitive: true,
                    importOrderSeparation: false,
                    importOrderSortSpecifiers: true,
                },
            ],
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
    },
]);
