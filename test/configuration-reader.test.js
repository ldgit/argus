const assert = require('assert');
const ConfigurationReader = require('../src/configuration-reader');

describe('ConfigurationReader', () => {
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
    configurationReader = new ConfigurationReader();
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
    it('should validate it', () => {
      assert.throws(() => {
        configurationReader.read('test/fixtures/invalid.config.js');
      }, TypeError);
    });

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
});
