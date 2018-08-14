module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test',
      sourceDir: 'src',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
      runAllTestsCommand: { command: 'npm', arguments: ['t'] },
    },
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/integration',
      sourceDir: 'src',
      arguments: [],
      testRunnerCommand: 'node_modules/.bin/mocha',
      runAllTestsCommand: { command: 'npm', arguments: ['run', 'test-int'] },
    },
  ],
};
