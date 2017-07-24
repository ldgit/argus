var assert = require('assert');
var CommandRunner = require('../src/command-runner');

describe('command-runner', function() {
    var commandRunner;
    var spawnSpyData = {
        lastCommand: null,
        lastArgs: null,
        lastOptions: null
    };

    var spawnSpy = function (command, args, options) {
        spawnSpyData.lastCommand = command;
        spawnSpyData.lastArgs = args;
        spawnSpyData.lastOptions = options;
    };

    it('should run given command', function() {
        commandRunner = new CommandRunner(spawnSpy);
        commandRunner.run({command: 'echo', args: ["what if this was a unit test command?"]});
        assert.equal(spawnSpyData.lastCommand, 'echo');
        assert.deepEqual(spawnSpyData.lastArgs, ["what if this was a unit test command?"]);
        assert.equal(spawnSpyData.lastOptions.stdio, 'inherit');
    });
});
