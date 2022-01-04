module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: ['standard-with-typescript', 'prettier/@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    },
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue', '.md'],
    sourceType: 'module'
  },
  rules: {
    camelcase: 'off',
    'space-before-function-paren': 'off',
    'no-unused-expressions': 0,
    '@typescript-eslint/strict-boolean-expressions': 'off'
  }
}
