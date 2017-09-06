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

    lowerCaseAllExtensionProperties(configuration.environments);

    return configuration;
  };

  function lowerCaseAllExtensionProperties(environments) {
    environments.forEach((environment) => {
      environment.extension = environment.extension.toLowerCase();
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
