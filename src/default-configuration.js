module.exports = function getDefaultConfiguration() {
  return {
    configFileFound: false,
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
};
