module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'mocha': true,
    'node': true,
    'es6': true,
  },
  'rules': {
    'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'no-param-reassign': 0,
    'max-len': ['warn', 120, 2, {
      'ignoreUrls': false,
      'ignoreComments': false,
    }],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      // Dangling comma causes problems on Node versions 6 and 7
      "functions": "never",
    }],
  }
};
