var CommandRunner = require('./command-runner');
var FileWatcher = require('./file-watcher');
var TestFinder = require('./test-finder');
var CommandBuilder = require('./command-builder');
var Watchlist = require('./watchlist');
var spawn = require('child_process').spawn;
var printer = require('./printer').create();

var testFinder = new TestFinder();

var argusModule = {
    factory: {
        create: function() {
            return new argusModule.Argus(new CommandRunner(spawn, printer));
        }
    },
    Argus: function(commandRunner) {
        this.run = function() {
            var fileWatcher = new FileWatcher(printer);
            var commandBuilder = new CommandBuilder();
            var watchlist = new Watchlist();

            fileWatcher.watchPhpFiles(watchlist.compileFrom(testFinder.getTestDir()), function (pathToChangedFile) {
                var testFilePath = testFinder.findTestFor(pathToChangedFile);
                var command = commandBuilder.buildFor(testFilePath);
                commandRunner.run(command);
            })
        };
    }
};

module.exports = argusModule;
