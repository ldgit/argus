const assert = require('assert');
const clock = require('lolex');
const spawnSync = require('child_process').spawnSync;
const { configureRunCommands } = require('../src/command-runner');
const nullPrinter = require('../src/printer').createNull();

describe('command-runner synchronous implementation', () => {
  it('smoke test', () => {
    configureRunCommands.bind(null, spawnSync, nullPrinter)([{ command: 'echo', args: [] }]);
  });
});

describe('command-runner', () => {
  let runCommands;
  let spawnSpyData;
  let spawnSpyWasCalled;
  const spawnSpy = (command, args, options) => {
    spawnSpyWasCalled = true;
    spawnSpyData.push({ command, args, options });
  };

  beforeEach(() => {
    spawnSpyData = [];
    spawnSpyWasCalled = false;
    runCommands = configureRunCommands.bind(null, spawnSpy, nullPrinter);
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
    let textSentToInfo;

    beforeEach(() => {
      textSentToInfo = [];
      nullPrinter.info = (text) => {
        textSentToInfo.push(text);
      };
    });

    it('should print info message', () => {
      clock.install({ now: new Date(2017, 7, 1, 18, 5, 5) });
      runCommands([{ command: 'echo', args: ['one'] }, { command: 'phpunit', args: ['-c', 'phpunit.xml'] }]);
      assert.equal(textSentToInfo[0], '[2017-08-01 18:05:05] echo one');
      assert.equal(textSentToInfo[1], '[2017-08-01 18:05:05] phpunit -c phpunit.xml');
    });
  });
});
