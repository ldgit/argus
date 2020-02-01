const { expect } = require('chai');
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
      expect(
        buildForFilepaths([
          { path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment },
        ])[0],
      ).to.eql({
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
      expect(
        buildForFilepaths([
          { path: 'tests/unit/src/ExampleOneTest.php', environment: phpEnvironment },
        ])[0],
      ).to.eql({
        command: 'vendor/bin/phpunit',
        args: ['tests/unit/src/ExampleOneTest.php'],
      });
    });

    it('should allow for modification of test run command through given environment', () => {
      phpEnvironment.testRunnerCommand.command = 'phpunit';
      expect(
        buildForFilepaths([
          { path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment },
        ])[0],
      ).to.eql({
        command: 'phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
    });

    it('should allow for additional arguments from environment configuration', () => {
      phpEnvironment.testRunnerCommand.arguments = ['-c', 'phpunit.xml'];
      expect(
        buildForFilepaths([
          { path: 'tests/src/ExampleOneTest.php', environment: phpEnvironment },
        ])[0],
      ).to.eql({
        command: 'vendor/bin/phpunit',
        args: ['-c', 'phpunit.xml', 'tests/src/ExampleOneTest.php'],
      });
    });
  });

  context('given multiple filepaths', () => {
    it('should return separate commands to run for each of them', () => {
      expect(
        buildForFilepaths([
          { path: 'tests/src/FirstTest.php', environment: phpEnvironment },
          { path: 'tests/src/SecondTest.php', environment: phpEnvironment },
        ]),
      ).to.eql([
        { command: 'vendor/bin/phpunit', args: ['tests/src/FirstTest.php'] },
        { command: 'vendor/bin/phpunit', args: ['tests/src/SecondTest.php'] },
      ]);
    });
  });

  it('should return an empty array if given an empty array', () => {
    expect(buildForFilepaths([])).to.eql([]);
  });
});
