module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'require-jsdoc': 0,
    'linebreak-style': ['error', 'windows'],
    'max-len': ['error', {code: 120}],
    'prefer-const': 'error',
  },
  extends: './node_modules/eslint-config-google/index.js',
};
