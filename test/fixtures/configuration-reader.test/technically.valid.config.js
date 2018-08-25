module.exports = {
  environments: [
    {
      extension: 'PHP',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: './',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: '.',
      testRunnerCommand: { command: 'node_modules/.bin/mocha', arguments: [] },
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: ' .  ',
      testRunnerCommand: { command: 'node_modules/.bin/mocha', arguments: [] },
    },
    {
      extension: 'JS',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: '  src ',
      testRunnerCommand: { command: 'node_modules/.bin/mocha', arguments: [] },
    },
  ],
};
