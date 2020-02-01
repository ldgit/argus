const { expect } = require('chai');
const lolex = require('lolex');
const { spawnSync } = require('child_process');
const { configureRunCommands } = require('../src/command-runner');
const { createPrinterSpy, format } = require('../src/printer');
const { StdinMock } = require('./helpers/mockStdio');
const wait = require('./helpers/wait');

describe('command-runner synchronous implementation', () => {
  it('smoke test', () => {
    configureRunCommands(
      spawnSync,
      createPrinterSpy(),
      process.stdin,
    )([{ command: 'echo', args: [] }]);
  });
});

describe('command-runner', () => {
  let runCommands;
  let spawnSpyData;
  let spawnSpyWasCalled;
  let printerSpy;
  let mockStdin;

  const spawnSpy = (command, args, options) => {
    spawnSpyWasCalled = true;
    spawnSpyData.push({ command, args, options });
  };

  beforeEach(() => {
    mockStdin = new StdinMock();
    spawnSpyData = [];
    spawnSpyWasCalled = false;
    printerSpy = createPrinterSpy();
    runCommands = configureRunCommands(spawnSpy, printerSpy, mockStdin, 'linux');
  });

  it('should run given commands', () => {
    runCommands([
      { command: 'echo', args: ['what if this was a unit test command?'] },
      { command: 'ls', args: ['-lah'] },
    ]);
    expect(spawnSpyData[0].command).to.equal('echo');
    expect(spawnSpyData[1].command).to.equal('ls');
    expect(spawnSpyData[0].args).to.eql(['what if this was a unit test command?']);
    expect(spawnSpyData[1].args).to.eql(['-lah']);
    expect(spawnSpyData[0].options.stdio).to.equal('inherit');
    expect(spawnSpyData[1].options.stdio).to.equal('inherit');
  });

  it('should do nothing if given empty array', () => {
    runCommands([]);
    // eslint-disable-next-line no-unused-expressions
    expect(spawnSpyWasCalled).to.be.false;
  });

  context('time sensitive stuff', () => {
    let clock;

    beforeEach(() => {
      clock = lolex.install({ now: new Date(2017, 7, 1, 18, 5, 5) });
    });

    afterEach(() => clock.uninstall());

    it('when running command should print info message', () => {
      runCommands([
        { command: 'echo', args: ['one'] },
        { command: 'phpunit', args: ['-c', 'phpunit.xml'] },
      ]);
      const printedMessages = printerSpy.getPrintedMessages();
      expect(printedMessages[0]).to.eql({
        text: '[2017-08-01 18:05:05] echo one',
        type: 'info',
      });
      expect(printedMessages[1]).to.eql({
        text: '[2017-08-01 18:05:05] phpunit -c phpunit.xml',
        type: 'info',
      });
    });
  });

  context('when running command', () => {
    it('should print info on how to list all commands', () => {
      runCommands([
        { command: 'echo', args: ['one'] },
        { command: 'echo', args: ['two'] },
      ]);

      expect(printerSpy.getPrintedMessages().length).to.equal(3);
      expect(printerSpy.getPrintedMessages()[2]).to.eql({
        text: `\nPress ${format.red('l')} to list available commands\n`,
        type: 'message',
      });
    });

    it('should not temporarily disable stdin raw mode on windows OS because this leads to weird behaviour (unable to rerun, list commands, etc.)', () => {
      runCommands = configureRunCommands(spawnSpy, printerSpy, mockStdin, 'win32');
      runCommands([{ command: 'npm', args: ['t'] }]);
      return wait(20).then(() => expect(mockStdin.rawModeCalled).to.be.false);
    });

    it('should temporarily disable stdin raw mode on non-windows OS so user can terminate the process during command execution', () => {
      runCommands = configureRunCommands(spawnSpy, printerSpy, mockStdin, 'linux');
      // We monkeypatch stdin.setRawMode() method to also log events to spawnSpyData array. We do this so we can assert
      // that setRawMode was called exactly before and after spawn function was called.
      const originalSetRawMode = mockStdin.setRawMode.bind(mockStdin);
      mockStdin.setRawMode = isRaw => {
        spawnSpyData.push(`raw mode set to ${isRaw}`);
        originalSetRawMode(isRaw);
      };

      runCommands([{ command: 'npm', args: ['t'] }]);

      expect(spawnSpyData[0]).to.equal('raw mode set to false');
      expect(spawnSpyData[1].command).to.equal('npm');
      expect(spawnSpyData[1].args).to.eql(['t']);
      expect(spawnSpyData[2]).to.equal('raw mode set to true');
    });
  });
});
