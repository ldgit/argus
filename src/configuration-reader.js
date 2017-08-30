const fs = require('fs');
const path = require('path');

module.exports = function ConfigurationReader() {
  const defaultConfiguration = {
    environments: [
      {
        extension: 'php',
        testNameSuffix: 'Test',
        testDir: 'tests/unit',
        sourceDir: '',
        arguments: [],
        testRunnerCommand: 'vendor/bin/phpunit',
      },
    ],
  };

  this.read = (configPath) => {
    if (typeof configPath === 'undefined') {
      return defaultConfiguration;
    }

    const absoluteConfigPath = path.resolve(configPath);

    if (!fs.existsSync(absoluteConfigPath)) {
      return defaultConfiguration;
    }

    const configuration = require(absoluteConfigPath);
    validate(configuration);

    return configuration;
  };

  this.validate = validate;

  function validate(configuration) {
    configuration.environments.forEach((environment) => {
      if (typeof environment.extension === 'undefined' || environment.extension === '') {
        throw new TypeError('extension must be defined for each environment');
      }

      if (typeof environment.testNameSuffix === 'undefined' || environment.testNameSuffix === '') {
        throw new TypeError('testNameSuffix must be defined for each environment');
      }

      if (typeof environment.testDir === 'undefined' || environment.testDir === '') {
        throw new TypeError('testNameSuffix must be defined for each environment');
      }

      if (typeof environment.testRunnerCommand === 'undefined' || environment.testRunnerCommand === '') {
        throw new TypeError('testRunnerCommand must be defined for each environment');
      }
    });
  }
};
