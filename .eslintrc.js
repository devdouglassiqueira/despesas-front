/* eslint-env node */
// .eslintrc.cjs  (ou .eslintrc.js usando CommonJS)
module.exports = {
  root: true,
  env: { browser: true, es2021: true, jest: true, node: true },

  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },

  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],

  settings: { react: { version: 'detect' } },

  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.eslintrc.*',
  ],

  rules: {
    // ⚠️ Torna “variável não usada” um ERRO que quebra o build
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_', // permite argumentos iniciados por _ (ex.: _evt)
        varsIgnorePattern: '^_', // permite variáveis iniciadas por _
      },
    ],

    // ⚠️ Torna “variável não declarada” um ERRO
    'no-undef': 'error',

    // Formatação via Prettier (apenas aviso)
    'prettier/prettier': 'warn',

    // Ruídos comuns em React moderno
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'no-console': 'off',
    'react/prop-types': 'warn',
  },

  overrides: [
    {
      files: ['**/*.{test,spec}.js', '**/__tests__/**'],
      env: { jest: true },
    },
  ],
};
