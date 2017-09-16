const fs = require('fs');
const path = require('path');
const Validator = require('./configuration-validator');

module.exports = function ConfigurationReader() {
  let wasConfigFileFound;

  this.read = (configPath) => {
    if (typeof configPath === 'undefined') {
      wasConfigFileFound = false;
      return getDefaultConfiguration();
    }

    const absoluteConfigPath = path.resolve(configPath);

    if (!fs.existsSync(absoluteConfigPath)) {
      wasConfigFileFound = false;
      return getDefaultConfiguration();
    }

    wasConfigFileFound = true;

    const configuration = require(absoluteConfigPath);
    (new Validator()).validate(configuration);

    normalizeAllEnvironments(configuration.environments);

    configuration.configFileFound = wasConfigFileFound;

    return configuration;
  };

  this.wasConfigFileFound = () => wasConfigFileFound;

  function normalizeAllEnvironments(environments) {
    environments.forEach((environment) => {
      environment.extension = environment.extension.toLowerCase();
      environment.sourceDir = ['.', './'].includes(environment.sourceDir.trim()) ? '' : environment.sourceDir.trim();
    });
  }

  function getDefaultConfiguration() {
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
  }
};
