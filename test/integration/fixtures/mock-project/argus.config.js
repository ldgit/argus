// Default configuration to use
// At least one environment must *not* have a runAllTestsCommand property
module.exports = {
  environments: [
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: '',
      testRunnerCommand: { command: 'echo', arguments: [] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests',
      sourceDir: '',
      testRunnerCommand: { command: 'echo', arguments: [] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/unit',
      sourceDir: '',
      testRunnerCommand: { command: 'echo', arguments: [] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test',
      sourceDir: '',
      testRunnerCommand: { command: 'echo', arguments: [] },
    },
  ],
};
