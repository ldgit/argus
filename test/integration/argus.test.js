const assert = require('assert');
const path = require('path');
const fork = require('child_process').fork;
const Argus = require('../../src/argus').Argus;

describe('argus', function argusTestSuite() {
  this.slow(500);

  const pathToTouchScript = path.join('.', '..', '..', 'helpers', 'touch.js');

  let argus;
  let lastRunCommand = '';
  let watcher;

  function CommandRunnerMock() {
    this.run = (command) => {
      lastRunCommand = command;
    };
  }

  beforeEach(() => {
    process.chdir(path.join('.', 'test', 'integration', 'mock-project'));
    argus = new Argus(new CommandRunnerMock());
  });

  afterEach(() => {
    watcher.close();
    process.chdir(path.join('.', '..', '..', '..'));
  });

  it('should watch project source files and run console command if they change', (done) => {
    watcher = argus.run('.');
    fork(pathToTouchScript, [path.join('.', 'src', 'PhpClass.php')]);

    watcher.on('change', () => {
      assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
      assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
      done();
    });
  });

  it('should watch project test files and run console command if they change', (done) => {
    watcher = argus.run();
    fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

    watcher.on('change', () => {
      assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
      assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
      done();
    });
  });
});
