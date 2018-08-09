const assert = require('assert');
const validateConfiguration = require('../src/configuration-validator');

describe('ConfigurationValidator', () => {
  let invalidEnvironment;
  let validEnvironment;
  let configuration;

  beforeEach(() => {
    validEnvironment = {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: 'src',
      arguments: ['-v'],
      testRunnerCommand: 'node_modules/.bin/mocha',
    };
    invalidEnvironment = JSON.parse(JSON.stringify(validEnvironment));
    configuration = { environments: [validEnvironment, invalidEnvironment] };
  });

  it('should throw error for empty or invalid extension', () => {
    invalidEnvironment.extension = '';
    assertExtensionMissingErrorThrown(() => { validateConfiguration(configuration); });

    delete invalidEnvironment.extension;
    assertExtensionMissingErrorThrown(() => { validateConfiguration(configuration); });
  });

  it('should throw error if extension starts with a dot', () => {
    invalidEnvironment.extension = '.php';
    assertErrorThrown(() => { validateConfiguration(configuration); }, /Extension must not start with a dot/);
  });

  it('should throw error for empty or invalid testNameSuffix', () => {
    invalidEnvironment.testNameSuffix = '';
    assertNoTestNameSuffixErrorThrown(() => { validateConfiguration(configuration); });

    delete invalidEnvironment.testNameSuffix;
    assertNoTestNameSuffixErrorThrown(() => { validateConfiguration(configuration); });
  });

  it('should throw error for empty or invalid testDir', () => {
    invalidEnvironment.testDir = '';
    assertNoTestDirErrorThrown(() => { validateConfiguration(configuration); });

    delete invalidEnvironment.testDir;
    assertNoTestDirErrorThrown(() => { validateConfiguration(configuration); });
  });

  it('should throw error for empty or invalid testRunnerCommand', () => {
    invalidEnvironment.testRunnerCommand = '';
    assertNoTestRunnerCommandErrorThrown(() => { validateConfiguration(configuration); });

    delete invalidEnvironment.testRunnerCommand;
    assertNoTestRunnerCommandErrorThrown(() => { validateConfiguration(configuration); });
  });

  it('should throw error for invalid testRunnerCommand arguments', () => {
    invalidEnvironment.arguments = '';
    assertInvalidTestRunnerCommandArgumentsErrorThrown(() => { validateConfiguration(configuration); });
  });

  function assertExtensionMissingErrorThrown(callback) {
    assert.throws(callback, TypeError);
    assert.throws(callback, /extension must be defined for each environment/);
  }

  function assertNoTestNameSuffixErrorThrown(callback) {
    assert.throws(callback, TypeError);
    assert.throws(callback, /testNameSuffix must be defined for each environment/);
  }

  function assertNoTestDirErrorThrown(callback) {
    assert.throws(callback, TypeError);
    assert.throws(callback, /testNameSuffix must be defined for each environment/);
  }

  function assertNoTestRunnerCommandErrorThrown(callback) {
    assert.throws(callback, TypeError);
    assert.throws(callback, /testRunnerCommand must be defined for each environment/);
  }

  function assertInvalidTestRunnerCommandArgumentsErrorThrown(callback) {
    assert.throws(callback, TypeError);
    assert.throws(callback, /arguments property must be an array/);
  }

  function assertErrorThrown(callback, regexMessage) {
    assert.throws(callback, TypeError);
    assert.throws(callback, regexMessage);
  }
});
