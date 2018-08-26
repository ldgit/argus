const assert = require('assert');
const { expect } = require('chai');
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
      testRunnerCommand: { command: 'node_modules/.bin/mocha' },
    };
    invalidEnvironment = JSON.parse(JSON.stringify(validEnvironment));
    configuration = { environments: [validEnvironment, invalidEnvironment] };
  });

  it('should throw error for empty or invalid extension', () => {
    invalidEnvironment.extension = '';
    assertExtensionMissingErrorThrown(() => validateConfiguration(configuration));

    delete invalidEnvironment.extension;
    assertExtensionMissingErrorThrown(() => validateConfiguration(configuration));
  });

  it('should throw error if extension starts with a dot', () => {
    invalidEnvironment.extension = '.php';
    expect(() => validateConfiguration(configuration)).to.throw(TypeError, /Extension must not start with a dot/);
  });

  it('should throw error for empty or invalid testNameSuffix', () => {
    invalidEnvironment.testNameSuffix = '';
    assertNoTestNameSuffixErrorThrown(() => validateConfiguration(configuration));

    delete invalidEnvironment.testNameSuffix;
    assertNoTestNameSuffixErrorThrown(() => validateConfiguration(configuration));
  });

  it('should throw error for empty or invalid testDir', () => {
    invalidEnvironment.testDir = '';
    assertNoTestDirErrorThrown(() => validateConfiguration(configuration));

    delete invalidEnvironment.testDir;
    assertNoTestDirErrorThrown(() => validateConfiguration(configuration));
  });

  [
    '',
    { arguments: [] },
    { command: 'mocha', arguments: '' },
    { command: {}, arguments: [] },
  ].forEach((invalidTestRunnerCommand) => {
    it(`should throw error for invalid testRunnerCommand (${JSON.stringify(invalidTestRunnerCommand)})`, () => {
      invalidEnvironment.testRunnerCommand = invalidTestRunnerCommand;
      assertNoTestRunnerCommandErrorThrown(() => validateConfiguration(configuration));
    });
  });

  it('should throw error if no testRunnerCommand defined', () => {
    delete invalidEnvironment.testRunnerCommand;
    assertNoTestRunnerCommandErrorThrown(() => validateConfiguration(configuration));
  });

  [
    { command: 'mocha' },
    { command: 'mocha', arguments: [] },
    { command: 'npm', arguments: ['t', '--'] },
  ].forEach((validTestRunnerCommand) => {
    it(`should allow valid test runner command (${JSON.stringify(validTestRunnerCommand)})`, () => {
      invalidEnvironment.testRunnerCommand = validTestRunnerCommand;
      validateConfiguration(configuration);
    });
  });

  [
    '',
    {},
    { arguments: [] },
    { command: 'foo' },
    { command: {}, arguments: [] },
    { command: '', arguments: '' },
    { command: '', args: [] },
  ].forEach((invalidRunAllTestCommand) => {
    it(`should throw error for invalid runAllTestsCommand (${JSON.stringify(invalidRunAllTestCommand)})`, () => {
      invalidEnvironment.runAllTestsCommand = invalidRunAllTestCommand;
      assert.throws(() => validateConfiguration(configuration), TypeError);
      assert.throws(() => validateConfiguration(configuration), /Invalid runAllTestsCommand property/);
    });
  });

  it('should allow valid runAllTestsCommand command', () => {
    invalidEnvironment.runAllTestsCommand = { command: 'mocha', arguments: [] };
    validateConfiguration(configuration);
  });

  function assertExtensionMissingErrorThrown(callback) {
    expect(callback).to.throw(TypeError, /extension must be defined for each environment/);
  }

  function assertNoTestNameSuffixErrorThrown(callback) {
    expect(callback).to.throw(TypeError, /testNameSuffix must be defined for each environment/);
  }

  function assertNoTestDirErrorThrown(callback) {
    expect(callback).to.throw(TypeError, 'Invalid test directory (environment.testDir)');
  }

  function assertNoTestRunnerCommandErrorThrown(callback) {
    expect(callback).to.throw(TypeError, /testRunnerCommand must be defined for each environment/);
  }
});
