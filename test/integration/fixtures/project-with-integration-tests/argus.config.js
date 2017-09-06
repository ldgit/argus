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
      testDir: 'tests/integration',
      sourceDir: '',
      arguments: ['-c', 'phpunit-integration.xml'],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
  ],
};
