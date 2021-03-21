module.exports = {
  env: {
    browser: true,
    node: true,
  },
  globals: {
    VERSION_INFO: true
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
};
