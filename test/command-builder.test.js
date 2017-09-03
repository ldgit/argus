const assert = require('assert');
const CommandBuilder = require('../src/command-builder');

describe('command-builder', () => {
  let commandBuilder;
  let phpEnvironment;
  let environments;

  beforeEach(() => {
    phpEnvironment = { extension: 'php', testRunnerCommand: 'vendor/bin/phpunit', arguments: [] };
    environments = [phpEnvironment];
    commandBuilder = new CommandBuilder(environments);
  });

  context('given a path to a test file', () => {
    it('should return a command to run test in the configured environment', () => {
      assert.deepEqual(commandBuilder.buildFor(['tests/src/ExampleOneTest.php'])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
      assert.deepEqual(commandBuilder.buildFor(['tests/unit/src/ExampleOneTest.php'])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/unit/src/ExampleOneTest.php'],
      });
    });

    it('should allow modification of a command to run ther test through configured environment', () => {
      phpEnvironment.testRunnerCommand = 'phpunit';
      assert.deepEqual(commandBuilder.buildFor(['tests/src/ExampleOneTest.php'])[0], {
        command: 'phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
    });

    it('should allow for additional configured arguments', () => {
      phpEnvironment.arguments = ['-c', 'phpunit.xml'];
      assert.deepEqual(commandBuilder.buildFor(['tests/src/ExampleOneTest.php'])[0], {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php', '-c', 'phpunit.xml'],
      });
    });

    it('should return empty array if no configured environments for given file extension', () => {
      environments.pop();
      assert.deepEqual(commandBuilder.buildFor(['tests/src/ExampleOneTest.php']), []);
      assert.deepEqual(commandBuilder.buildFor(['tests/unit/src/ExampleOneTest.php']), []);
      assert.deepEqual(
        commandBuilder.buildFor(['tests/src/ExampleOneTest.php', 'tests/unit/src/ExampleOneTest.php']), []
      );
    });
  });

  context('given multiple filepaths', () => {
    it('should return separate commands to run for each of them', () => {
      assert.deepEqual(
        commandBuilder.buildFor(['tests/src/FirstTest.php', 'tests/src/SecondTest.php']),
        [
          { command: 'vendor/bin/phpunit', args: ['tests/src/FirstTest.php'] },
          { command: 'vendor/bin/phpunit', args: ['tests/src/SecondTest.php'] },
        ]
      );
    });
  });

  context('given two environments', () => {
    it('should detect correct environment for file from file extension', () => {
      const jsEnvironment = { extension: 'js', testRunnerCommand: 'node_modules/.bin/mocha', arguments: [] };
      environments.push(jsEnvironment);

      assert.deepEqual(commandBuilder.buildFor(['tests/src/module.test.js', 'tests/src/ExampleOneTest.php']), [
        { command: 'node_modules/.bin/mocha', args: ['tests/src/module.test.js'] },
        { command: 'vendor/bin/phpunit', args: ['tests/src/ExampleOneTest.php'] },
      ]);
    });
  });

  it('should return an empty array if given an empty array', () => {
    assert.deepEqual(commandBuilder.buildFor([]), []);
  });

  it('should return an empty array if given an array with empty strings', () => {
    assert.deepEqual(commandBuilder.buildFor(['']), []);
    assert.deepEqual(commandBuilder.buildFor(['', '']), []);
  });
});
