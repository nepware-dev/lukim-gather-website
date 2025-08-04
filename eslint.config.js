import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    ignores: [
      '**/*.css',
      '*.scss',
      '*.svg',
      '**/images/**',
      '**/icons/**',
      '**/fonts/**',
      'node_modules/**',
      'build/**',
      'src/components/Map/index.tsx',
      'src/vendor/react-arsenal',
      '@ra/**',
      'public/xforms/**'
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      ...react.configs['jsx-runtime'].rules,
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.tsx']
        }
      ],
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',

      'import/prefer-default-export': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^@ra/.*$'],
        },
      ],
      
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',

      'no-var': 'error',
      'no-unused-vars': 'off',
      'eqeqeq': [
        'error',
        'always',
        {
          null: 'ignore'
        }
      ],
      'eol-last': ['error', 'always'],
      'comma-style': ['error', 'last'],
      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true
        }
      ],
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'jsx-quotes': ['error', 'prefer-single'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'object-curly-spacing': ['error', 'never'],
      'no-shadow': 'off',
      'no-nested-ternary': 'off',

      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg']
        },
        typescript: {
          alwaysTryTypes: true,
        }
      }
    }
  }
];
