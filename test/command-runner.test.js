const assert = require('assert');
const clock = require('lolex');
const CommandRunner = require('../src/command-runner');
const nullPrinter = require('../src/printer').createNull();

describe('command-runner', () => {
  let commandRunner;
  let spawnSpyData;
  const spawnSpy = (command, args, options) => {
    spawnSpyData.wasCalled = true;
    spawnSpyData.lastCommand = command;
    spawnSpyData.lastArgs = args;
    spawnSpyData.lastOptions = options;
  };

  beforeEach(() => {
    commandRunner = new CommandRunner(spawnSpy, nullPrinter);
    spawnSpyData = { lastCommand: null, lastArgs: null, lastOptions: null, wasCalled: false };
  });

  it('should run given command', () => {
    commandRunner.run({ command: 'echo', args: ['what if this was a unit test command?'] });
    assert.equal(spawnSpyData.lastCommand, 'echo');
    assert.deepEqual(spawnSpyData.lastArgs, ['what if this was a unit test command?']);
    assert.equal(spawnSpyData.lastOptions.stdio, 'inherit');
  });

  it('should not run null commands', () => {
    commandRunner.run({ command: '', args: [''] });
    assert.strictEqual(spawnSpyData.wasCalled, false);

    commandRunner.run({ command: '', args: ['neki argument'] });
    assert.strictEqual(spawnSpyData.wasCalled, false);
  });

  context('when running command', () => {
    let textSentToInfo;
    beforeEach(() => {
      textSentToInfo = '';
      nullPrinter.info = (text) => {
        textSentToInfo = text;
      };
    });

    it('should print info message', () => {
      clock.install({ now: new Date(2017, 7, 1, 18, 5, 42) });
      commandRunner.run({ command: 'echo', args: ['some arg'] });
      assert.equal(textSentToInfo, '[2017-08-01 18:05:42] echo "some arg"');
    });
  });
});
