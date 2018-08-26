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
      `Configuration file not found at ${absoluteConfigPath}. You must provide a configuration file.`,
    );
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const configuration = require(absoluteConfigPath);
  validateConfiguration(configuration);
  configuration.environments = configuration.environments.map(normalizeEnvironment);

  return configuration;
};

function normalizeEnvironment(environment) {
  const normalizedEnvironment = Object.assign(environment, {
    extension: environment.extension.toLowerCase(),
    sourceDir: ['.', './'].includes(environment.sourceDir.trim()) ? '' : environment.sourceDir.trim(),
  });
  if (typeof normalizedEnvironment.testRunnerCommand.arguments === 'undefined') {
    normalizedEnvironment.testRunnerCommand.arguments = [];
  }

  return normalizedEnvironment;
}
