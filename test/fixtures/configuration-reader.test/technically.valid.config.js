module.exports = {
  environments: [
    {
      extension: 'PHP',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: 'src',
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: 'src',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
  ],
};
