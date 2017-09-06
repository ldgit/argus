const assert = require('assert');
const path = require('path');
const fork = require('child_process').fork;
const Argus = require('../../src/argus').Argus;

describe('argus', function argusTestSuite() {
  this.slow(500);

  const rootDir = process.cwd();
  const pathToTouchScript = path.join(rootDir, 'test', 'helpers', 'touch.js');

  let argus;
  let lastRunCommands = [];
  let watcher;
  let commandLineOptions;

  function CommandRunnerMock() {
    this.run = (commands) => {
      lastRunCommands = commands;
    };
  }

  beforeEach(() => {
    commandLineOptions = { config: 'argus.config.js' };
  });

  afterEach(() => {
    watcher.close();
    process.chdir(rootDir);
  });

  context('mock-project', () => {
    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'mock-project'));
      argus = new Argus(new CommandRunnerMock(), commandLineOptions);
    });

    it('should watch project source files and run console command if they change', (done) => {
      watcher = argus.run('.');
      fork(pathToTouchScript, [path.join('.', 'src', 'PhpClass.php')]);

      watcher.on('change', () => {
        assert.equal(lastRunCommands[0].command, 'vendor/bin/phpunit');
        assert.deepEqual(lastRunCommands[0].args, ['tests/src/PhpClassTest.php']);
        done();
      });
    });

    it('should watch project test files and run console command if they change', (done) => {
      watcher = argus.run();
      fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

      watcher.on('change', () => {
        assert.equal(lastRunCommands[0].command, 'vendor/bin/phpunit');
        assert.deepEqual(lastRunCommands[0].args, ['tests/src/PhpClassTest.php']);
        done();
      });
    });
  });

  context('project-with-integration-tests', () => {
    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'project-with-integration-tests'));
      argus = new Argus(new CommandRunnerMock(), commandLineOptions);
    });

    it('should watch project with multiple environments for same file extension', (done) => {
      watcher = argus.run();
      fork(pathToTouchScript, [path.join('.', 'src', 'Class.php')]);

      watcher.on('change', () => {
        assert.equal(lastRunCommands.length, 2, 'Expected only two commands to run');
        assert.equal(lastRunCommands[0].command, 'vendor/bin/phpunit');
        assert.deepEqual(lastRunCommands[0].args, ['tests/unit/src/ClassTest.php']);
        assert.equal(lastRunCommands[1].command, 'vendor/bin/phpunit');
        assert.deepEqual(
          lastRunCommands[1].args,
          ['-c', 'phpunit-integration.xml', 'tests/integration/src/ClassTest.php']
        );
        done();
      });
    });
  });
});
