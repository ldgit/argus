module.exports = {
  extends: ['airbnb-base', 'plugin:chai-expect/recommended', 'prettier'],
  env: {
    mocha: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-use-before-define': ['error', { functions: false, classes: true }],
  },
};
