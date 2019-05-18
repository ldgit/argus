const path = require('path');
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
    expect(readConfigurationFromNonExistingFile).to.throw(TypeError, path.join('some/file/that/does/not/exist.js'));
  });

  context('if given a configuration file', () => {
    it('should validate it', () => {
      expect(() => {
        readConfiguration('test/fixtures/configuration-reader.test/invalid.config.js');
      }).to.throw(TypeError);
    });

    it('should import and return it', () => {
      expect(readConfiguration('test/fixtures/configuration-reader.test/valid.config.js').environments).to.deep.equal([
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
      expect(config.environments[0].extension).to.equal('php');
      expect(config.environments[1].extension).to.equal('js');
    });

    it('should assign empty array to arguments property for testRunnerCommand if missing', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/no-test-command-arguments.config.js');
      expect(config.environments[0].testRunnerCommand.arguments).to.deep.equal([]);
      expect(config.environments[1].testRunnerCommand.arguments).to.deep.equal(['t', '--']);
      expect(config.environments[2].testRunnerCommand.arguments).to.deep.equal([]);
    });

    it('should use empty string for sourceDir if source is current directory', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/technically.valid.config.js');
      expect(config.environments[0].sourceDir).to.equal('');
      expect(config.environments[1].sourceDir).to.equal('');
      expect(config.environments[2].sourceDir).to.equal('');
    });

    it('should trim source directory when reading it', () => {
      const config = readConfiguration('test/fixtures/configuration-reader.test/technically.valid.config.js');
      expect(config.environments[3].sourceDir).to.equal('src');
    });
  });
});
