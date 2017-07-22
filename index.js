var CommandRunner = require('./src/command-runner');
var FileWatcher = require('./src/file-watcher');
var TestFinder = require('./src/test-finder');
var CommandBuilder = require('./src/command-builder');
var spawn = require('child_process').spawn;

var fileWatcher = new FileWatcher();
var testFinder = new TestFinder();
var commandBuilder = new CommandBuilder();
var commandRunner = new CommandRunner(spawn);

fileWatcher.watchPhpFiles('.', function (pathToChangedFile) {
    var testFilePath = testFinder.findTestFor(pathToChangedFile);
    var command = commandBuilder.buildFor(testFilePath);
    commandRunner.run(command);
})
