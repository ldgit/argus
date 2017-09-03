const assert = require('assert');
const clock = require('lolex');
const CommandRunner = require('../src/command-runner').class;
const nullPrinter = require('../src/printer').createNull();
const commandRunnerSyncImpl = require('../src/command-runner').getSynchronousImplementation(nullPrinter);

describe('command-runner synchronous implementation', () => {
  it('smoke test', () => {
    commandRunnerSyncImpl.run([{ command: 'echo', args: [] }]);
  });
});

describe('command-runner', () => {
  let commandRunner;
  let spawnSpyData;
  let spawnSpyWasCalled;
  const spawnSpy = (command, args, options) => {
    spawnSpyWasCalled = true;
    spawnSpyData.push({ command, args, options });
  };

  beforeEach(() => {
    spawnSpyData = [];
    spawnSpyWasCalled = false;
    commandRunner = new CommandRunner(spawnSpy, nullPrinter);
  });

  it('should run given commands', () => {
    commandRunner.run([
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
    commandRunner.run([]);
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
      commandRunner.run([{ command: 'echo', args: ['one'] }, { command: 'echo', args: ['two'] }]);
      assert.equal(textSentToInfo[0], '[2017-08-01 18:05:05] echo "one"');
      assert.equal(textSentToInfo[1], '[2017-08-01 18:05:05] echo "two"');
    });
  });
});
