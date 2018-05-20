const fs = require('fs');
const path = require('path');
const validateConfiguration = require('./configuration-validator');
const getDefaultConfiguration = require('./default-configuration');

module.exports = function readConfiguration(configPath) {
  let wasConfigFileFound;

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
  validateConfiguration(configuration);
  normalizeAllEnvironments(configuration.environments);

  configuration.configFileFound = wasConfigFileFound;

  return configuration;
};

function normalizeAllEnvironments(environments) {
  environments.forEach((environment) => {
    environment.extension = environment.extension.toLowerCase();
    environment.sourceDir = ['.', './'].includes(environment.sourceDir.trim()) ? '' : environment.sourceDir.trim();
  });
}
