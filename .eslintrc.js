module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'mocha': true,
    'node': true,
    'es6': true
  },
  'rules': {
    'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
    'import/no-dynamic-require': 0,
    'global-require': 0
  }
};
