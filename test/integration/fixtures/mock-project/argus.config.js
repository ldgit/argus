// Default configuration to use
module.exports = {
  environments: [
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: '',
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests',
      sourceDir: '',
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/unit',
      sourceDir: '',
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test',
      sourceDir: '',
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
  ],
};
