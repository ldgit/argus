const assert = require('assert');
const lolex = require('lolex');
const { spawnSync } = require('child_process');
const { configureRunCommands } = require('../src/command-runner');
const { createPrinterSpy, format } = require('../src/printer');
const { StdinMock } = require('./helpers/mockStdio');

describe('command-runner synchronous implementation', () => {
  it('smoke test', () => {
    configureRunCommands.bind(null, spawnSync, createPrinterSpy(), process.stdin)([{ command: 'echo', args: [] }]);
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
    runCommands = configureRunCommands(spawnSpy, printerSpy, mockStdin);
  });

  it('should run given commands', () => {
    runCommands([
      { command: 'echo', args: ['what if this was a unit test command?'] },
      { command: 'ls', args: ['-lah'] },
    ]);
    assert.equal(spawnSpyData[0].command, 'echo');
    assert.equal(spawnSpyData[1].command, 'ls');
    assert.deepEqual(spawnSpyData[0].args, ['what if this was a unit test command?']);
    assert.deepEqual(spawnSpyData[1].args, ['-lah']);
    assert.equal(spawnSpyData[0].options.stdio, 'inherit');
    assert.equal(spawnSpyData[1].options.stdio, 'inherit');
  });

  it('should do nothing if given empty array', () => {
    runCommands([]);
    assert.strictEqual(spawnSpyWasCalled, false);
  });

  context('when running command', () => {
    let clock;

    beforeEach(() => {
      clock = lolex.install({ now: new Date(2017, 7, 1, 18, 5, 5) });
    });

    afterEach(() => {
      clock.uninstall();
    });

    it('should print info message', () => {
      runCommands([{ command: 'echo', args: ['one'] }, { command: 'phpunit', args: ['-c', 'phpunit.xml'] }]);
      const printedMessages = printerSpy.getPrintedMessages();
      assert.deepStrictEqual(printedMessages[0], { text: '[2017-08-01 18:05:05] echo one', type: 'info' });
      assert.deepStrictEqual(printedMessages[1], { text: '[2017-08-01 18:05:05] phpunit -c phpunit.xml', type: 'info' });
    });

    it('should print info on how to list all commands', () => {
      runCommands([{ command: 'echo', args: ['one'] }, { command: 'echo', args: ['two'] }]);

      assert.equal(printerSpy.getPrintedMessages().length, 3);
      assert.deepStrictEqual(
        printerSpy.getPrintedMessages()[2],
        { text: `\nPress ${format.red('l')} to list available commands\n`, type: 'message' }
      );
    });

    it('should temporarily disable stdin raw mode so user can terminate the process during command execution', () => {
      // We monkeypatch stdin.setRawMode() method to also log events to spawnSpyData array
      const originalSetRawMode = mockStdin.setRawMode.bind(mockStdin);
      mockStdin.setRawMode = (isRaw) => {
        spawnSpyData.push(`raw mode set to ${isRaw}`);
        originalSetRawMode(isRaw);
      };

      runCommands([{ command: 'npm', args: ['t'] }]);

      assert.deepStrictEqual(spawnSpyData[0], 'raw mode set to false');
      assert.strictEqual(spawnSpyData[1].command, 'npm');
      assert.deepStrictEqual(spawnSpyData[1].args, ['t']);
      assert.deepStrictEqual(spawnSpyData[2], 'raw mode set to true');
    });
  });
});
