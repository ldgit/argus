var assert = require('assert');
var CommandRunner = require('../src/command-runner');
var nullPrinter = require('../src/printer').createNull();

describe('command-runner', function() {
    var commandRunner;
    var spawnSpyData;

    beforeEach(function() {
        commandRunner = new CommandRunner(spawnSpy, nullPrinter);
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

    context('when running command', function() {
        var textSentToInfo;
        beforeEach(function() {
            textSentToInfo = '';
            nullPrinter.info = function(text) {
                textSentToInfo = text;
            };
        });

        it('should print info message', function() {
            commandRunner.run({command: 'echo', args: ['some arg']});
            assert.equal(textSentToInfo, 'echo "some arg"');
        });
    });
});
