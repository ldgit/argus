const { expect } = require('chai');
const { StdinMock } = require('./helpers/mockStdio');
const {
  listenForUserInput,
  unconfiguredListenForUserInput,
  setLastRunCommands,
} = require('./../src/user-input-handler');
const createRunCommandsSpy = require('./helpers/run-commands-spy');
const { format, createPrinterSpy } = require('../src/printer');
const { runCommands } = require('./../src/command-runner');
const wait = require('./helpers/wait');

describe('configureListenForInput', () => {
  let mockStdin;
  let listenForInput;
  let runCommandsSpy;
  let printerSpy;
  let processExitCalled;
  let processExitCalledPromise;
  let environments;

  beforeEach(() => {
    environments = [{ testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] } }];
    mockStdin = new StdinMock({ decodeStrings: false });
    mockStdin.pause();
    runCommandsSpy = createRunCommandsSpy();
    printerSpy = createPrinterSpy();

    processExitCalled = false;
    let processExit;
    processExitCalledPromise = new Promise(resolve => {
      processExit = () => {
        processExitCalled = true;
        resolve();
      };
    });

    listenForInput = unconfiguredListenForUserInput.bind(
      null,
      processExit,
      printerSpy,
      runCommandsSpy,
      mockStdin,
    );
  });

  it('should start listening for user input in raw mode', () => {
    listenForInput(environments);
    // eslint-disable-next-line no-unused-expressions
    expect(mockStdin.isInRawMode()).to.be.true;
    // eslint-disable-next-line no-unused-expressions
    expect(mockStdin.isPaused()).to.be.false;
  });

  it('should use utf8 encoding', () => {
    listenForInput(environments);
    expect(mockStdin.getEncoding()).to.equal('utf8');
  });

  it('should stop the program if given ctrl+c command', () => {
    listenForInput(environments);
    mockStdin.push('\u0003');
    return processExitCalledPromise;
  });

  it('should not stop the program otherwise', () => {
    listenForInput(environments);
    mockStdin.push('not important');
    return wait(40).then(() => expect(processExitCalled).to.be.false);
  });

  it('should not do anything if user gives it unrecognized command', () => {
    listenForInput(environments);

    return new Promise(resolve => {
      mockStdin.on('data', resolve);
      mockStdin.push('w');
    }).then(() =>
      expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(0, 'Should not run any commands'),
    );
  });

  ['l', 'L'].forEach(userInput => {
    it(`should list available commands when user inputs "${userInput}"`, () => {
      listenForInput(environments);
      expect(printerSpy.getPrintedMessages().length).to.equal(
        0,
        'No messages printed before "l" is pressed',
      );

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(
          0,
          'Should not run any commands in this commands',
        );
        expect(printerSpy.getPrintedMessages()[0]).to.eql({
          text: '\nCommands list',
          type: 'title',
        });
        expect(printerSpy.getPrintedMessages()[1]).to.eql({
          text: `  press ${format.yellow('r')} to rerun last test batch`,
          type: 'message',
        });
        expect(printerSpy.getPrintedMessages()[2]).to.eql({
          text: `  press ${format.green('a')} to run all tests\n`,
          type: 'message',
        });
      });
    });
  });

  ['r', 'R'].forEach(userInput => {
    it(`should not do anything if ordered to run last test batch (${userInput}), but no tests have run yet`, () => {
      listenForInput(environments);

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(0, 'No commands yet');
      });
    });
  });

  ['r', 'R'].forEach(userInput => {
    it(`should rerun last batch of commands when user inputs "${userInput}"`, () => {
      const commands = [{ command: 'echo', args: ['a unit test command?'] }];
      listenForInput(environments);
      setLastRunCommands(commands);
      expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(
        0,
        'No commands should be run before user input.',
      );

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(1);
        expect(runCommandsSpy.getLastRunCommands()).to.eql(commands);
        expect(printerSpy.getPrintedMessages().length).to.equal(
          0,
          'No messages should be printed on the screen',
        );
      });
    });
  });

  ['a', 'A'].forEach(userInput => {
    it(`should run all tests when user inputs "${userInput}" using test runner command without a filepath argument`, () => {
      environments = [{ testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] } }];

      listenForInput(environments);

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(
          0,
          'Command must run only on user input',
        );
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(1);
        expect(runCommandsSpy.getLastRunCommands()).to.eql([
          { command: 'vendor/bin/phpunit', args: [] },
        ]);
      });
    });
  });

  ['a', 'A'].forEach(userInput => {
    it(`should use runAllTestsCommand if given in environment configuration to run all tests (${userInput})`, () => {
      environments = [
        {
          testRunnerCommand: { command: 'should/not/use/this/comnand', arguments: [] },
          runAllTestsCommand: { command: 'vendor/bin/phpunit', arguments: ['-c', 'phpunit.xml'] },
        },
      ];

      listenForInput(environments);

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getCommandsBatchRunCount()).to.equal(1);
        expect(runCommandsSpy.getLastRunCommands()).to.eql([
          { command: 'vendor/bin/phpunit', args: ['-c', 'phpunit.xml'] },
        ]);
      });
    });
  });

  ['a', 'A'].forEach(userInput => {
    it(`should run all tests when user inputs "${userInput}" (multiple environments)`, () => {
      environments = [
        { testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] } },
        { testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] } },
        { testRunnerCommand: { command: 'mocha', arguments: [] } },
      ];

      listenForInput(environments);

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getLastRunCommands()).to.eql([
          { command: 'vendor/bin/phpunit', args: [] },
          { command: 'mocha', args: [] },
        ]);
      });
    });
  });

  ['a', 'A'].forEach(userInput => {
    it(`should run all tests when user inputs "${userInput}" (multiple of same type, but with additional arguments)`, () => {
      environments = [
        { testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: ['-c', 'phpunit.xml'] } },
        {
          testRunnerCommand: {
            command: 'vendor/bin/phpunit',
            arguments: ['-c', 'phpunit-integration.xml'],
          },
        },
        { testRunnerCommand: { command: 'mocha', arguments: [] } },
      ];

      listenForInput(environments);

      return new Promise(resolve => {
        mockStdin.on('data', resolve);
        mockStdin.push(userInput);
      }).then(() => {
        expect(runCommandsSpy.getLastRunCommands()).to.eql([
          { command: 'vendor/bin/phpunit', args: ['-c', 'phpunit.xml'] },
          { command: 'vendor/bin/phpunit', args: ['-c', 'phpunit-integration.xml'] },
          { command: 'mocha', args: [] },
        ]);
      });
    });
  });
});

describe('configured user input listener', () => {
  it('can be called and closed without problems', () => {
    listenForUserInput(runCommands, process.stdin, []);
    // eslint-disable-next-line no-unused-expressions
    expect(process.stdin.isPaused()).to.be.false;
    process.stdin.pause();
    // eslint-disable-next-line no-unused-expressions
    expect(process.stdin.isPaused()).to.be.true;
  });
});
