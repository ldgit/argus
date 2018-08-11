module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test',
      sourceDir: 'src',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/integration',
      sourceDir: 'src',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
  ],
};
