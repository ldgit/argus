const fs = require('fs');
const path = require('path');
const Validator = require('./configuration-validator');

module.exports = function ConfigurationReader() {
  this.read = (configPath) => {
    if (typeof configPath === 'undefined') {
      return getDefaultConfiguration();
    }

    const absoluteConfigPath = path.resolve(configPath);

    if (!fs.existsSync(absoluteConfigPath)) {
      return getDefaultConfiguration();
    }

    const configuration = require(absoluteConfigPath);
    (new Validator()).validate(configuration);

    normalizeAllEnvironments(configuration.environments);

    return configuration;
  };

  function normalizeAllEnvironments(environments) {
    environments.forEach((environment) => {
      environment.extension = environment.extension.toLowerCase();
      environment.sourceDir = ['.', './'].includes(environment.sourceDir.trim()) ? '' : environment.sourceDir.trim();
    });
  }

  function getDefaultConfiguration() {
    return {
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
  }
};
