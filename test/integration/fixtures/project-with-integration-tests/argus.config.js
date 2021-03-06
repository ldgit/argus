module.exports = {
  environments: [
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: '',
      testRunnerCommand: { command: 'vendor/bin/phpunit' },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/integration',
      sourceDir: '',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: ['-c', 'phpunit-integration.xml'] },
    },
  ],
};
