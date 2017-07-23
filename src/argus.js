var CommandRunner = require('./command-runner');
var FileWatcher = require('./file-watcher');
var TestFinder = require('./test-finder');
var CommandBuilder = require('./command-builder');
var spawn = require('child_process').spawn;

var testFinder = new TestFinder();

var argusModule = {
    factory: {
        create: function() {
            return new argusModule.Argus(new CommandRunner(spawn));
        }
    },
    Argus: function(commandRunner) {
        this.run = function(inDir) {
            var fileWatcher = new FileWatcher();
            var commandBuilder = new CommandBuilder();       

            fileWatcher.watchPhpFiles(inDir, function (pathToChangedFile) {
                var testFilePath = testFinder.findTestFor(pathToChangedFile);
                var command = commandBuilder.buildFor(testFilePath);
                commandRunner.run(command);
            })
        };
    }
};

module.exports = argusModule;
