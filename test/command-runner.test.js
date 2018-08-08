const assert = require('assert');
const lolex = require('lolex');
const spawnSync = require('child_process').spawnSync;
const { configureRunCommands } = require('../src/command-runner');
const { createPrinterSpy, format } = require('../src/printer');

describe('command-runner synchronous implementation', () => {
  it('smoke test', () => {
    configureRunCommands.bind(null, spawnSync, createPrinterSpy())([{ command: 'echo', args: [] }]);
  });
});

describe('command-runner', () => {
  let runCommands;
  let spawnSpyData;
  let spawnSpyWasCalled;
  let printerSpy;
  const spawnSpy = (command, args, options) => {
    spawnSpyWasCalled = true;
    spawnSpyData.push({ command, args, options });
  };

  beforeEach(() => {
    spawnSpyData = [];
    spawnSpyWasCalled = false;
    printerSpy = createPrinterSpy();
    runCommands = configureRunCommands(spawnSpy, printerSpy);
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
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], { text: '[2017-08-01 18:05:05] echo one', type: 'info' });
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[1], { text: '[2017-08-01 18:05:05] phpunit -c phpunit.xml', type: 'info' });
    });

    it('should print info on how to list all commands', () => {
      runCommands([{ command: 'echo', args: ['one'] }, { command: 'echo', args: ['two'] }]);

      assert.equal(printerSpy.getPrintedMessages().length, 3);
      assert.deepStrictEqual(
        printerSpy.getPrintedMessages()[2],
        { text: `Press "${format.red('l')}" to list available commands`, type: 'message' }
      );
    });
  });
});
