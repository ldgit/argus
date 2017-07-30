const assert = require('assert');
const Argus = require('../../src/argus').Argus;
const fork = require('child_process').fork;

describe('argus', function argusTestSuite() {
  this.slow(500);

  let argus;
  let lastRunCommand = '';
  const timeoutDuration = 'TRAVIS' in process.env ? 1000 : 400;

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
    process.chdir('./../../../');
  });

  it('should watch project source files and run console command if they change', (done) => {
    argus.run('.');
    fork('./../../helpers/touch.js', ['./src/PhpClass.php']);

    setTimeout(() => {
      assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
      assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
      done();
    }, timeoutDuration);
  });

  it('should watch project test files and run console command if they change', (done) => {
    argus.run();
    fork('./../../helpers/touch.js', ['./tests/src/PhpClassTest.php']);

    setTimeout(() => {
      assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
      assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
      done();
    }, timeoutDuration);
  });
});
