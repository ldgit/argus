const assert = require('assert');
const Configuration = require('../src/configuration');

describe('configuration', () => {
  let configurationReader;
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

  beforeEach(() => {
    configurationReader = new Configuration();
  });

  context('if no configuration file given', () => {
    it('should use default php configuration (to avoid BC breaks)', () => {
      assert.deepEqual(configurationReader.read(), defaultConfiguration);
    });
  });

  context('if given configuration file does not exist', () => {
    it('should use default php configuration', () => {
      assert.deepEqual(configurationReader.read('some/file/that/does/not/exist.js'), defaultConfiguration);
    });
  });

  context('if given configuration file', () => {
    it('should import and return it', () => {
      assert.deepEqual(configurationReader.read('test/fixtures/valid.config.js'), {
        environments: [
          {
            extension: 'js',
            testNameSuffix: '.test',
            testDir: 'test/unit',
            sourceDir: 'src',
            arguments: ['-v'],
            testRunnerCommand: 'node_modules/.bin/mocha',
          },
        ],
      });
    });
  });

  context('validation', () => {
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
      assertExtensionMissingErrorThrown(() => { configurationReader.validate(configuration); });

      delete invalidEnvironment.extension;
      assertExtensionMissingErrorThrown(() => { configurationReader.validate(configuration); });
    });

    it('should throw error for empty or invalid testNameSuffix', () => {
      invalidEnvironment.testNameSuffix = '';
      assertNoTestNameSuffixErrorThrown(() => { configurationReader.validate(configuration); });

      delete invalidEnvironment.testNameSuffix;
      assertNoTestNameSuffixErrorThrown(() => { configurationReader.validate(configuration); });
    });

    it('should throw error for empty or invalid testDir', () => {
      invalidEnvironment.testDir = '';
      assertNoTestDirErrorThrown(() => { configurationReader.validate(configuration); });

      delete invalidEnvironment.testDir;
      assertNoTestDirErrorThrown(() => { configurationReader.validate(configuration); });
    });

    it('should throw error for empty or invalid testRunnerCommand', () => {
      invalidEnvironment.testRunnerCommand = '';
      assertNoTestRunnerCommandErrorThrown(() => { configurationReader.validate(configuration); });

      delete invalidEnvironment.testRunnerCommand;
      assertNoTestRunnerCommandErrorThrown(() => { configurationReader.validate(configuration); });
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
  });

  it('should validate given configuration file', () => {
    assert.throws(() => {
      configurationReader.read('test/fixtures/invalid.config.js');
    }, TypeError);
  });
});
