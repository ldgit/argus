module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test',
      sourceDir: 'src',
      testRunnerCommand: { command: 'npm', arguments: ['t', '--'] },
      runAllTestsCommand: { command: 'npm', arguments: ['t'] },
    },
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/integration',
      sourceDir: 'src',
      testRunnerCommand: { command: 'npm', arguments: ['t', '--'] },
      runAllTestsCommand: { command: 'npm', arguments: ['run', 'test-int'] },
    },
  ],
};
