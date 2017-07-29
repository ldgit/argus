const assert = require('assert');
const CommandBuilder = require('../src/command-builder');

describe('command-builder', () => {
  let commandBuilder;

  beforeEach(() => {
    commandBuilder = new CommandBuilder();
  });

  context('given a path to php test file', () => {
    it('should return a command to run in phpunit', () => {
      assert.deepEqual(commandBuilder.buildFor('tests/src/ExampleOneTest.php'), {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
      assert.deepEqual(commandBuilder.buildFor('tests/unit/src/ExampleOneTest.php'), {
        command: 'vendor/bin/phpunit',
        args: ['tests/unit/src/ExampleOneTest.php'],
      });
    });
  });

  context('if given an empty string', () => {
    it('should return a null command', () => {
      assert.deepEqual(commandBuilder.buildFor(''), { command: '', args: [''] });
    });
  });
});
