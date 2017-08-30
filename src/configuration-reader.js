const fs = require('fs');
const path = require('path');
const Validator = require('./configuration-validator');

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
    (new Validator()).validate(configuration);

    return configuration;
  };
};
