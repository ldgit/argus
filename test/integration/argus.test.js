const assert = require('assert');
const path = require('path');
const { fork } = require('child_process');
const { configureRunArgus } = require('../../src/argus');
const { runCommands } = require('../../src/command-runner');
const createRunCommandsSpy = require('../helpers/run-commands-spy');
const { StdinMock } = require('./../helpers/mockStdio');

const wait = miliseconds => new Promise(resolve => setTimeout(resolve, miliseconds));
const waitForDebounce = () => wait(110);

describe('argus', function argusTestSuite() {
  this.slow(500);

  const rootDir = process.cwd();
  const pathToTouchScript = path.join(rootDir, 'test', 'helpers', 'touch.js');

  let runArgus;
  let watcher;
  let commandLineOptions;
  let mockStdin;

  beforeEach(() => {
    mockStdin = new StdinMock({ decodeStrings: false });
    commandLineOptions = { config: 'argus.config.js' };
  });

  afterEach(() => {
    watcher.close();
    process.stdin.pause();
    process.chdir(rootDir);
  });

  context('mock-project', () => {
    let runCommandsSpy;

    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'mock-project'));
      runCommandsSpy = createRunCommandsSpy();
      runArgus = configureRunArgus(runCommandsSpy, commandLineOptions, mockStdin);
    });

    it('should watch project source files and run console command if they change', () => {
      watcher = runArgus('.');
      fork(pathToTouchScript, [path.join('.', 'src', 'PhpClass.php')]);

      return new Promise((resolve) => {
        watcher.on('change', () => {
          waitForDebounce().then(() => resolve(runCommandsSpy.getLastRunCommands()[0]));
        });
      }).then(({ command, args }) => {
        assert.equal(command, 'echo');
        assert.deepEqual(args, ['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));
      });
    }).timeout(500);

    it('should watch project test files and run console command if they change', () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

      return new Promise((resolve) => {
        watcher.on('change', () => {
          waitForDebounce().then(() => resolve(runCommandsSpy.getLastRunCommands()[0]));
        });
      }).then(({ command, args }) => {
        assert.equal(command, 'echo');
        assert.deepEqual(args, ['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));
      });
    });

    it('should run last run command when user inputs "r"', () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

      return new Promise((resolve) => {
        watcher.on('change', () => {
          waitForDebounce().then(() => {
            assert.strictEqual(runCommandsSpy.getCommandsBatchRunCount(), 1);
            resolve(runCommandsSpy.getLastRunCommands()[0]);
          });
        });
      }).then(({ command, args }) => {
        assert.equal(command, 'echo');
        assert.deepEqual(args, ['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));

        return new Promise((resolve) => {
          mockStdin.on('data', resolve);
          mockStdin.push('r');
        });
      }).then(() => {
        assert.strictEqual(runCommandsSpy.getCommandsBatchRunCount(), 2);
        assert.equal(runCommandsSpy.getLastRunCommands()[0].command, 'echo');
        assert.deepEqual(runCommandsSpy.getLastRunCommands()[0].args, ['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));
      });
    });

    it('should run ok when user inputs "a" (smoke test)', () => {
      runArgus = configureRunArgus(runCommands, commandLineOptions, mockStdin);
      watcher = runArgus();

      return new Promise((resolve) => {
        mockStdin.on('data', resolve);
        mockStdin.push('a');
      });
    });
  });

  context('project-with-integration-tests', () => {
    let runCommandsSpy;

    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'project-with-integration-tests'));
      runCommandsSpy = createRunCommandsSpy();
      runArgus = configureRunArgus(runCommandsSpy, commandLineOptions, mockStdin);
    });

    it('should watch project with multiple environments for same file extension', () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'src', 'Class.php')]);

      return new Promise((resolve) => {
        watcher.on('change', () => {
          waitForDebounce().then(() => {
            resolve({
              commandCount: runCommandsSpy.getLastRunCommands().length,
              firstCommand: runCommandsSpy.getLastRunCommands()[0],
              secondCommand: runCommandsSpy.getLastRunCommands()[1],
            });
          });
        });
      }).then(({ commandCount, firstCommand, secondCommand }) => {
        assert.equal(commandCount, 2, 'Expected only two commands to run');
        assert.equal(firstCommand.command, 'vendor/bin/phpunit');
        assert.deepEqual(firstCommand.args, ['tests/unit/src/ClassTest.php'].map(filepath => path.join(filepath)));
        assert.equal(secondCommand.command, 'vendor/bin/phpunit');
        assert.deepEqual(
          secondCommand.args,
          ['-c', 'phpunit-integration.xml', 'tests/integration/src/ClassTest.php'].map(filepath => path.join(filepath)),
        );
      });
    });
  });
});
