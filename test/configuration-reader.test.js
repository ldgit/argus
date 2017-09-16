const assert = require('assert');
const ConfigurationReader = require('../src/configuration-reader');

describe('ConfigurationReader', () => {
  let configurationReader;

  beforeEach(() => {
    configurationReader = new ConfigurationReader();
  });

  context('if no configuration file given', () => {
    it('should use default php configuration (to avoid BC breaks)', () => {
      assert.deepEqual(configurationReader.read(), getDefaultConfiguration());
    });
  });

  context('if given configuration file does not exist', () => {
    it('should use default php configuration', () => {
      assert.deepEqual(configurationReader.read('some/file/that/does/not/exist.js'), getDefaultConfiguration());
    });
  });

  context('if given a configuration file', () => {
    it('should validate it', () => {
      assert.throws(() => {
        configurationReader.read('test/fixtures/configuration-reader.test/invalid.config.js');
      }, TypeError);
    });

    it('should import and return it', () => {
      assert.deepEqual(configurationReader.read('test/fixtures/configuration-reader.test/valid.config.js').environments, [
        {
          extension: 'js',
          testNameSuffix: '.test',
          testDir: 'test/unit',
          sourceDir: 'src',
          arguments: ['-v'],
          testRunnerCommand: 'node_modules/.bin/mocha',
        },
      ]);
    });

    it('should lowercase each environment extension automatically', () => {
      const config = configurationReader.read('test/fixtures/configuration-reader.test/technically.valid.config.js');
      assert.equal(config.environments[0].extension, 'php');
      assert.equal(config.environments[1].extension, 'js');
    });

    it('should use empty string for sourceDir if source is current directory', () => {
      const config = configurationReader.read('test/fixtures/configuration-reader.test/technically.valid.config.js');
      assert.equal(config.environments[0].sourceDir, '');
      assert.equal(config.environments[1].sourceDir, '');
      assert.equal(config.environments[2].sourceDir, '');
    });

    it('should trim source directory when reading it', () => {
      const config = configurationReader.read('test/fixtures/configuration-reader.test/technically.valid.config.js');
      assert.equal(config.environments[3].sourceDir, 'src');
    });
  });

  context('wasConfigFileFound() method', () => {
    it('should set configFileFound flag to true if file was found, false otherwise', () => {
      // Deliberately put all assertions inside one test to ensure that the state was correctly mantained
      let config = configurationReader.read('test/fixtures/configuration-reader.test/valid.config.js');
      assert.strictEqual(config.configFileFound, true);
      config = configurationReader.read('test/fixtures/configuration-reader.test/nonexistent.config.js');
      assert.strictEqual(config.configFileFound, false);
      config = configurationReader.read('test/fixtures/configuration-reader.test/valid.config.js');
      assert.strictEqual(config.configFileFound, true);
      config = configurationReader.read();
      assert.strictEqual(config.configFileFound, false);
    });
  });

  function getDefaultConfiguration() {
    return {
      configFileFound: false,
      environments: [
        {
          extension: 'php',
          testNameSuffix: 'Test',
          testDir: 'tests/unit',
          sourceDir: '',
          arguments: [],
          testRunnerCommand: 'vendor/bin/phpunit',
        },
        {
          extension: 'php',
          testNameSuffix: 'Test',
          testDir: 'tests',
          sourceDir: '',
          arguments: [],
          testRunnerCommand: 'vendor/bin/phpunit',
        },
        {
          extension: 'php',
          testNameSuffix: 'Test',
          testDir: 'test/unit',
          sourceDir: '',
          arguments: [],
          testRunnerCommand: 'vendor/bin/phpunit',
        },
        {
          extension: 'php',
          testNameSuffix: 'Test',
          testDir: 'test',
          sourceDir: '',
          arguments: [],
          testRunnerCommand: 'vendor/bin/phpunit',
        },
      ],
    };
  }
});
