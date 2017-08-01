const assert = require('assert');
const fork = require('child_process').fork;
const Argus = require('../../src/argus').Argus;

describe('argus', function argusTestSuite() {
  this.slow(500);

  let argus;
  let lastRunCommand = '';
  let watcher;

  function CommandRunnerMock() {
    this.run = (command) => {
      lastRunCommand = command;
    };
  }

  beforeEach(() => {
    process.chdir('./test/integration/mock-project/');
    argus = new Argus(new CommandRunnerMock());
  });

  afterEach(() => {
    watcher.close();
    process.chdir('./../../../');
  });

  it('should watch project source files and run console command if they change', (done) => {
    watcher = argus.run('.');
    fork('./../../helpers/touch.js', ['./src/PhpClass.php']);

    watcher.on('change', () => {
      assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
      assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
      done();
    });
  });

  it('should watch project test files and run console command if they change', (done) => {
    watcher = argus.run();
    fork('./../../helpers/touch.js', ['./tests/src/PhpClassTest.php']);

    watcher.on('change', () => {
      assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
      assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
      done();
    });
  });
});
