const assert = require('assert');
const { buildForFilepaths } = require('../src/command-builder');

/* buildCommandsToRunAllTests() function is tested through user-input-handler tests */
describe('command-builder', () => {
  let phpEnvironment;

  beforeEach(() => {
    phpEnvironment = {
      extension: 'php',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    };
  });

  context('given a path to a test file', () => {
    it('should return a command to run test in the given environment', () => {
      assert.deepEqual(buildForFilepaths([{ path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
      assert.deepEqual(buildForFilepaths([{ path: 'tests/unit/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/unit/src/ExampleOneTest.php'],
      });
    });

    it('should allow for modification of test run command through given environment', () => {
      phpEnvironment.testRunnerCommand.command = 'phpunit';
      assert.deepEqual(buildForFilepaths([{ path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
    });

    it('should allow for additional arguments from environment configuration', () => {
      phpEnvironment.testRunnerCommand.arguments = ['-c', 'phpunit.xml'];
      assert.deepEqual(buildForFilepaths([{ path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment }])[0], {
        command: 'vendor/bin/phpunit',
        args: ['-c', 'phpunit.xml', 'tests/src/ExampleOneTest.php'],
      });
    });
  });

  context('given multiple filepaths', () => {
    it('should return separate commands to run for each of them', () => {
      assert.deepEqual(
        buildForFilepaths([
          { path: 'tests/src/FirstTest.php', environment: phpEnvironment },
          { path: 'tests/src/SecondTest.php', environment: phpEnvironment },
        ]),
        [
          { command: 'vendor/bin/phpunit', args: ['tests/src/FirstTest.php'] },
          { command: 'vendor/bin/phpunit', args: ['tests/src/SecondTest.php'] },
        ],
      );
    });
  });

  it('should return an empty array if given an empty array', () => {
    assert.deepEqual(buildForFilepaths([]), []);
  });
});
