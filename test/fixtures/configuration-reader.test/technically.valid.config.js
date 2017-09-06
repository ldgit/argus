module.exports = {
  environments: [
    {
      extension: 'PHP',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: './',
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: '.',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: ' .  ',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: '  src ',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
  ],
};
