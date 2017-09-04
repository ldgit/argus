const assert = require('assert');
const CommandBuilder = require('../src/command-builder');

describe('command-builder', () => {
  let commandBuilder;
  let phpEnvironment;

  beforeEach(() => {
    phpEnvironment = { extension: 'php', testRunnerCommand: 'vendor/bin/phpunit', arguments: [] };
    commandBuilder = new CommandBuilder();
  });

  context('given a path to a test file', () => {
    it('should return a command to run test in the given environment', () => {
      assert.deepEqual(commandBuilder.buildFor([{ path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
      assert.deepEqual(commandBuilder.buildFor([{ path: 'tests/unit/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/unit/src/ExampleOneTest.php'],
      });
    });

    it('should allow for modification of test run command through given environment', () => {
      phpEnvironment.testRunnerCommand = 'phpunit';
      assert.deepEqual(commandBuilder.buildFor([{ path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
    });

    it('should allow for additional configured arguments', () => {
      phpEnvironment.arguments = ['-c', 'phpunit.xml'];
      assert.deepEqual(commandBuilder.buildFor([{ path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'vendor/bin/phpunit',
        args: ['-c', 'phpunit.xml', 'tests/src/ExampleOneTest.php'],
      });
    });
  });

  context('given multiple filepaths', () => {
    it('should return separate commands to run for each of them', () => {
      assert.deepEqual(
        commandBuilder.buildFor([
          { path: 'tests/src/FirstTest.php', environment: phpEnvironment },
          { path: 'tests/src/SecondTest.php', environment: phpEnvironment },
        ]),
        [
          { command: 'vendor/bin/phpunit', args: ['tests/src/FirstTest.php'] },
          { command: 'vendor/bin/phpunit', args: ['tests/src/SecondTest.php'] },
        ]
      );
    });
  });

  it('should return an empty array if given an empty array', () => {
    assert.deepEqual(commandBuilder.buildFor([]), []);
  });
});
