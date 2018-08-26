module.exports = {
  environments: [
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: './',
      testRunnerCommand: { command: 'vendor/bin/phpunit' },
    },
    {
      extension: 'js',
      testNameSuffix: 'test',
      testDir: 'tests/unit',
      sourceDir: './',
      testRunnerCommand: { command: 'npm', arguments: ['t', '--'] },
    },
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/integration',
      sourceDir: './',
      testRunnerCommand: { command: 'vendor/bin/phpunit' },
    },
  ],
};
