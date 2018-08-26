const assert = require('assert');
const { expect } = require('chai');
const readConfiguration = require('../src/configuration-reader');

describe('readConfiguration', () => {
  [undefined, {}, [], 0].forEach((nonStringFilePath) => {
    it(`should exit with error message if given configuration file path is not a string ${JSON.stringify(nonStringFilePath)}`, () => {
      expect(() => readConfiguration(nonStringFilePath)).to.throw(TypeError, 'Invalid configuration file path');
    });
  });

  it('should exit with error message if given configuration file does not exist', () => {
    const readConfigurationFromNonExistingFile = () => readConfiguration('some/file/that/does/not/exist.js');
    expect(readConfigurationFromNonExistingFile).to.throw(TypeError, /some\/file\/that\/does\/not\/exist.js/);
  });

  context('if given a configuration file', () => {
    it('should validate it', () => {
      expect(() => {
        readConfiguration('test/fixtures/configuration-reader.test/invalid.config.js');
      }).to.throw(TypeError);
    });

    it('should import and return it', () => {
      assert.deepEqual(readConfiguration('test/fixtures/configuration-reader.test/valid.config.js').environments, [
        {
          extension: 'js',
          testNameSuffix: '.test',
          testDir: 'test/unit',
          sourceDir: 'src',
          testRunnerCommand: { command: 'node_modules/.bin/mocha', arguments: ['-v'] },
        },
      ]);
    });

    it('should lowercase each environment extension automatically', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/technically.valid.config.js');
      assert.equal(config.environments[0].extension, 'php');
      assert.equal(config.environments[1].extension, 'js');
    });

    it('should assign empty array to arguments property for testRunnerCommand if missing', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/no-test-command-arguments.config.js');
      assert.deepStrictEqual(config.environments[0].testRunnerCommand.arguments, []);
      assert.deepStrictEqual(config.environments[1].testRunnerCommand.arguments, ['t', '--']);
      assert.deepStrictEqual(config.environments[2].testRunnerCommand.arguments, []);
    });

    it('should use empty string for sourceDir if source is current directory', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/technically.valid.config.js');
      assert.equal(config.environments[0].sourceDir, '');
      assert.equal(config.environments[1].sourceDir, '');
      assert.equal(config.environments[2].sourceDir, '');
    });

    it('should trim source directory when reading it', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/technically.valid.config.js');
      assert.equal(config.environments[3].sourceDir, 'src');
    });
  });
});
