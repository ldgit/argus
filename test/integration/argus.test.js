const assert = require('assert');
const path = require('path');
const fork = require('child_process').fork;
const { configureRunArgus } = require('../../src/argus');

describe('argus', function argusTestSuite() {
  this.slow(500);

  const rootDir = process.cwd();
  const pathToTouchScript = path.join(rootDir, 'test', 'helpers', 'touch.js');

  let runArgus;
  let watcher;
  let commandLineOptions;

  beforeEach(() => {
    commandLineOptions = { config: 'argus.config.js' };
  });

  afterEach(() => {
    watcher.close();
    process.chdir(rootDir);
  });

  context('mock-project', () => {
    let runCommandsSpy;

    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'mock-project'));
      runCommandsSpy = createRunCommandsSpy();
      runArgus = configureRunArgus(runCommandsSpy, commandLineOptions);
    });

    it('should watch project source files and run console command if they change', (done) => {
      watcher = runArgus('.');
      fork(pathToTouchScript, [path.join('.', 'src', 'PhpClass.php')]);

      watcher.on('change', () => {
        assert.equal(runCommandsSpy.getLastRunCommands()[0].command, 'vendor/bin/phpunit');
        assert.deepEqual(runCommandsSpy.getLastRunCommands()[0].args, ['tests/src/PhpClassTest.php']);
        done();
      });
    });

    it('should watch project test files and run console command if they change', (done) => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

      watcher.on('change', () => {
        assert.equal(runCommandsSpy.getLastRunCommands()[0].command, 'vendor/bin/phpunit');
        assert.deepEqual(runCommandsSpy.getLastRunCommands()[0].args, ['tests/src/PhpClassTest.php']);
        done();
      });
    });
  });

  context('project-with-integration-tests', () => {
    let runCommandsSpy;

    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'project-with-integration-tests'));
      runCommandsSpy = createRunCommandsSpy();
      runArgus = configureRunArgus(runCommandsSpy, commandLineOptions);
    });

    it('should watch project with multiple environments for same file extension', (done) => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'src', 'Class.php')]);

      watcher.on('change', () => {
        assert.equal(runCommandsSpy.getLastRunCommands().length, 2, 'Expected only two commands to run');
        assert.equal(runCommandsSpy.getLastRunCommands()[0].command, 'vendor/bin/phpunit');
        assert.deepEqual(runCommandsSpy.getLastRunCommands()[0].args, ['tests/unit/src/ClassTest.php']);
        assert.equal(runCommandsSpy.getLastRunCommands()[1].command, 'vendor/bin/phpunit');
        assert.deepEqual(
          runCommandsSpy.getLastRunCommands()[1].args,
          ['-c', 'phpunit-integration.xml', 'tests/integration/src/ClassTest.php']
        );
        done();
      });
    });
  });
});

function createRunCommandsSpy() {
  let lastRunCommands = [];
  const runCommands = (commands) => {
    lastRunCommands = commands;
  };

  runCommands.getLastRunCommands = () => lastRunCommands;

  return runCommands;
}
