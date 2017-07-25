var assert = require('assert');
var CommandRunner = require('../src/command-runner');

describe('command-runner', function() {
    var commandRunner;
    var spawnSpyData;

    beforeEach(function() {
        commandRunner = new CommandRunner(spawnSpy);
        spawnSpyData = {
            lastCommand: null,
            lastArgs: null,
            lastOptions: null,
            wasCalled: false
        };
    });

    var spawnSpy = function (command, args, options) {
        spawnSpyData.wasCalled = true;
        spawnSpyData.lastCommand = command;
        spawnSpyData.lastArgs = args;
        spawnSpyData.lastOptions = options;
    };

    it('should run given command', function() {
        commandRunner.run({command: 'echo', args: ["what if this was a unit test command?"]});
        assert.equal(spawnSpyData.lastCommand, 'echo');
        assert.deepEqual(spawnSpyData.lastArgs, ["what if this was a unit test command?"]);
        assert.equal(spawnSpyData.lastOptions.stdio, 'inherit');
    });

    it('should not run null commands', function() {
        commandRunner.run({command: '', args: ['']});
        assert.strictEqual(spawnSpyData.wasCalled, false);
        commandRunner.run({command: '', args: ['neki argument']});
        assert.strictEqual(spawnSpyData.wasCalled, false);
    });
});
