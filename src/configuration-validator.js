module.exports = function validateConfiguration(configuration) {
  configuration.environments.forEach(environment => {
    if (typeof environment.extension === 'undefined' || environment.extension === '') {
      throw new TypeError('extension must be defined for each environment');
    }

    if (environment.extension.startsWith('.')) {
      throw new TypeError('Extension must not start with a dot');
    }

    if (typeof environment.testNameSuffix === 'undefined' || environment.testNameSuffix === '') {
      throw new TypeError('testNameSuffix must be defined for each environment');
    }

    if (typeof environment.testDir === 'undefined' || environment.testDir === '') {
      throw new TypeError('Invalid test directory (environment.testDir)');
    }

    if (
      typeof environment.testRunnerCommand === 'undefined' ||
      environment.testRunnerCommand === ''
    ) {
      throw new TypeError('testRunnerCommand must be defined for each environment');
    }

    if (
      typeof environment.testRunnerCommand !== 'object' ||
      typeof environment.testRunnerCommand.command !== 'string' ||
      (typeof environment.testRunnerCommand.arguments !== 'undefined' &&
        !Array.isArray(environment.testRunnerCommand.arguments))
    ) {
      throw new TypeError('testRunnerCommand must be defined for each environment');
    }

    if (
      typeof environment.runAllTestsCommand !== 'undefined' &&
      (!Array.isArray(environment.runAllTestsCommand.arguments) ||
        typeof environment.runAllTestsCommand.command !== 'string')
    ) {
      throw new TypeError('Invalid runAllTestsCommand property');
    }
  });
};
