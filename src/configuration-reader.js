const fs = require('fs');
const path = require('path');
const validateConfiguration = require('./configuration-validator');

module.exports = function readConfiguration(configPath) {
  if (typeof configPath !== 'string') {
    throw TypeError('Invalid configuration file path');
  }

  const absoluteConfigPath = path.resolve(configPath);

  if (!fs.existsSync(absoluteConfigPath)) {
    throw new TypeError(
      `Configuration file not found at ${absoluteConfigPath}. You must provide a configuration file.`
    );
  }

  const configuration = require(absoluteConfigPath);
  validateConfiguration(configuration);
  normalizeAllEnvironments(configuration.environments);

  return configuration;
};

function normalizeAllEnvironments(environments) {
  environments.forEach((environment) => {
    environment.extension = environment.extension.toLowerCase();
    environment.sourceDir = ['.', './'].includes(environment.sourceDir.trim()) ? '' : environment.sourceDir.trim();
    if (typeof environment.testRunnerCommand.arguments === 'undefined') {
      environment.testRunnerCommand.arguments = [];
    }
  });
}
