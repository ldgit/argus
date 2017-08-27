const assert = require('assert');
const CommandBuilder = require('../src/command-builder');

describe('command-builder', () => {
  let commandBuilder;
  let phpEnvironment;
  let environments;
  const nullCommand = { command: '', args: [] };

  beforeEach(() => {
    phpEnvironment = { extension: 'php', testRunnerCommand: 'vendor/bin/phpunit', arguments: [] };
    environments = [phpEnvironment];
    commandBuilder = new CommandBuilder(environments);
  });

  context('given a path to php test file', () => {
    it('should return a command to run test if php is one of the configured environments', () => {
      assert.deepEqual(commandBuilder.buildFor('tests/src/ExampleOneTest.php'), {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
      assert.deepEqual(commandBuilder.buildFor('tests/unit/src/ExampleOneTest.php'), {
        command: 'vendor/bin/phpunit',
        args: ['tests/unit/src/ExampleOneTest.php'],
      });
    });

    it('should return a command to run test with configured command', () => {
      phpEnvironment.testRunnerCommand = 'phpunit';
      assert.deepEqual(commandBuilder.buildFor('tests/src/ExampleOneTest.php'), {
        command: 'phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
    });

    it('should return a command to run test with additional configured arguments', () => {
      phpEnvironment.arguments = ['-c', 'phpunit.xml'];
      assert.deepEqual(commandBuilder.buildFor('tests/src/ExampleOneTest.php'), {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php', '-c', 'phpunit.xml'],
      });
    });

    it('should return null command php is not one of the configured environments', () => {
      environments.pop();
      assert.deepEqual(commandBuilder.buildFor('tests/src/ExampleOneTest.php'), nullCommand);
      assert.deepEqual(commandBuilder.buildFor('tests/unit/src/ExampleOneTest.php'), nullCommand);
    });
  });

  context('given two environments', () => {
    it('should detect correct environment for file from file extension', () => {
      const jsEnvironment = { extension: 'js', testRunnerCommand: 'node_modules/.bin/mocha', arguments: [] };
      environments.push(jsEnvironment);

      assert.deepEqual(commandBuilder.buildFor('tests/src/module.test.js'), {
        command: 'node_modules/.bin/mocha',
        args: ['tests/src/module.test.js'],
      });
      assert.deepEqual(commandBuilder.buildFor('tests/src/ExampleOneTest.php'), {
        command: 'vendor/bin/phpunit',
        args: ['tests/src/ExampleOneTest.php'],
      });
    });
  });

  context('given an empty string', () => {
    it('should return a null command', () => {
      assert.deepEqual(commandBuilder.buildFor(''), nullCommand);
    });
  });
});
