const { expect } = require('chai');
const path = require('path');
const { fork } = require('child_process');
const { configureRunArgus } = require('../../src/argus');
const { runCommands } = require('../../src/command-runner');
const createRunCommandsSpy = require('../helpers/run-commands-spy');
const { StdinMock } = require('../helpers/mockStdio');

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

      return new Promise(resolve => {
        watcher.on('change', () => {
          waitForDebounce().then(() => resolve(runCommandsSpy.getLastRunCommands()[0]));
        });
      }).then(({ command, args }) => {
        expect(command).to.equal('echo');
        expect(args).to.eql(['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));
      });
    }).timeout(500);

    it('should watch project test files and run console command if they change', () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

      return new Promise(resolve => {
        watcher.on('change', () => {
          waitForDebounce().then(() => resolve(runCommandsSpy.getLastRunCommands()[0]));
        });
      }).then(({ command, args }) => {
        expect(command).to.equal('echo');
        expect(args).to.eql(['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));
      });
    });

    it('should run last run command when user inputs "r"', () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'tests', 'src', 'PhpClassTest.php')]);

      return new Promise(resolve => {
        watcher.on('change', () => {
          waitForDebounce().then(() => {
            expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(1);
            resolve(runCommandsSpy.getLastRunCommands()[0]);
          });
        });
      })
        .then(({ command, args }) => {
          expect(command).to.equal('echo');
          expect(args).to.eql(['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)));

          return new Promise(resolve => {
            mockStdin.on('data', resolve);
            mockStdin.push('r');
          });
        })
        .then(() => {
          expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(2);
          expect(runCommandsSpy.getLastRunCommands()[0].command).to.equal('echo');
          expect(runCommandsSpy.getLastRunCommands()[0].args).to.eql(
            ['tests/src/PhpClassTest.php'].map(filepath => path.join(filepath)),
          );
        });
    });

    it('should run ok when user inputs "a" (smoke test)', () => {
      runArgus = configureRunArgus(runCommands, commandLineOptions, mockStdin);
      watcher = runArgus();

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push('a');
      });
    });
  });

  context('project-with-integration-tests', () => {
    let runCommandsSpy;

    beforeEach(() => {
      process.chdir(
        path.join('.', 'test', 'integration', 'fixtures', 'project-with-integration-tests'),
      );
      runCommandsSpy = createRunCommandsSpy();
      runArgus = configureRunArgus(runCommandsSpy, commandLineOptions, mockStdin);
    });

    it('should watch project with multiple environments for same file extension', () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'src', 'Class.php')]);

      return new Promise(resolve => {
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
        expect(commandCount).to.equal(2, 'Expected only two commands to run');
        expect(firstCommand.command).to.equal('vendor/bin/phpunit');
        expect(firstCommand.args).to.eql(
          ['tests/unit/src/ClassTest.php'].map(filepath => path.join(filepath)),
        );
        expect(secondCommand.command).to.equal('vendor/bin/phpunit');
        expect(secondCommand.args).to.eql(
          ['-c', 'phpunit-integration.xml', 'tests/integration/src/ClassTest.php'].map(filepath =>
            path.join(filepath),
          ),
        );
      });
    });
  });

  context('tests-and-source-together', () => {
    let runCommandsSpy;

    beforeEach(() => {
      process.chdir(path.join('.', 'test', 'integration', 'fixtures', 'tests-and-source-together'));
      runCommandsSpy = createRunCommandsSpy();
      runArgus = configureRunArgus(runCommandsSpy, commandLineOptions, mockStdin);
    });

    it('should watch project with test and source next to each other', async () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'src', 'app.js')]);

      const { commandCount, firstCommand } = await new Promise(resolve => {
        watcher.on('change', () => {
          waitForDebounce().then(() => {
            resolve({
              commandCount: runCommandsSpy.getLastRunCommands().length,
              firstCommand: runCommandsSpy.getLastRunCommands()[0],
            });
          });
        });
      });

      expect(commandCount).to.equal(1, 'Expected one command to run');
      expect(firstCommand.command).to.equal('echo "I test thee"');
      expect(firstCommand.args).to.eql(['src/app.test.js'].map(filepath => path.join(filepath)));
    });

    it('should watch project with test and source next to each other (test file changed)', async () => {
      watcher = runArgus();
      fork(pathToTouchScript, [path.join('.', 'src', 'app.test.js')]);

      const { commandCount, firstCommand } = await new Promise(resolve => {
        watcher.on('change', () => {
          waitForDebounce().then(() => {
            resolve({
              commandCount: runCommandsSpy.getLastRunCommands().length,
              firstCommand: runCommandsSpy.getLastRunCommands()[0],
            });
          });
        });
      });

      expect(commandCount).to.equal(1, 'Expected one command to run');
      expect(firstCommand.command).to.equal('echo "I test thee"');
      expect(firstCommand.args).to.eql(['src/app.test.js'].map(filepath => path.join(filepath)));
    });
  });
});
