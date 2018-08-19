module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test',
      sourceDir: 'src',
      arguments: ['t', '--'],
      testRunnerCommand: 'npm',
      runAllTestsCommand: { command: 'npm', arguments: ['t'] },
    },
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/integration',
      sourceDir: 'src',
      arguments: ['t', '--'],
      testRunnerCommand: 'npm',
      runAllTestsCommand: { command: 'npm', arguments: ['run', 'test-int'] },
    },
  ],
};
