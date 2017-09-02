const assert = require('assert');
const ConfigurationValidator = require('../src/configuration-validator');

describe('ConfigurationValidator', () => {
  let configurationValidator;
  let invalidEnvironment;
  let validEnvironment;
  let configuration;

  beforeEach(() => {
    configurationValidator = new ConfigurationValidator();
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
    assertExtensionMissingErrorThrown(() => { configurationValidator.validate(configuration); });

    delete invalidEnvironment.extension;
    assertExtensionMissingErrorThrown(() => { configurationValidator.validate(configuration); });
  });

  it('should throw error if extension starts with a dot', () => {
    invalidEnvironment.extension = '.php';
    assertErrorThrown(() => { configurationValidator.validate(configuration); }, /Extension must not start with a dot/);
  });

  it('should throw error for empty or invalid testNameSuffix', () => {
    invalidEnvironment.testNameSuffix = '';
    assertNoTestNameSuffixErrorThrown(() => { configurationValidator.validate(configuration); });

    delete invalidEnvironment.testNameSuffix;
    assertNoTestNameSuffixErrorThrown(() => { configurationValidator.validate(configuration); });
  });

  it('should throw error for empty or invalid testDir', () => {
    invalidEnvironment.testDir = '';
    assertNoTestDirErrorThrown(() => { configurationValidator.validate(configuration); });

    delete invalidEnvironment.testDir;
    assertNoTestDirErrorThrown(() => { configurationValidator.validate(configuration); });
  });

  it('should throw error for empty or invalid testRunnerCommand', () => {
    invalidEnvironment.testRunnerCommand = '';
    assertNoTestRunnerCommandErrorThrown(() => { configurationValidator.validate(configuration); });

    delete invalidEnvironment.testRunnerCommand;
    assertNoTestRunnerCommandErrorThrown(() => { configurationValidator.validate(configuration); });
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

  function assertErrorThrown(callback, regexMessage) {
    assert.throws(callback, TypeError);
    assert.throws(callback, regexMessage);
  }
});
