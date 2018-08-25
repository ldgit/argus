// Default configuration to use
module.exports = {
  environments: [
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: '',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests',
      sourceDir: '',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/unit',
      sourceDir: '',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test',
      sourceDir: '',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
  ],
};
