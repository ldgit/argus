module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'mocha': true,
    'node': true,
    'es6': true,
  },
  'rules': {
    'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
    'max-len': ['warn', 120, 2, {
      'ignoreUrls': false,
      'ignoreComments': false,
    }],
  }
};
