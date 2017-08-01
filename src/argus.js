const CommandRunner = require('./command-runner');
const FileWatcher = require('./file-watcher');
const TestFinder = require('./test-finder');
const CommandBuilder = require('./command-builder');
const Watchlist = require('./watchlist');
const spawn = require('child_process').spawn;
const printer = require('./printer').create();

const testFinder = new TestFinder();

const argusModule = {
  factory: {
    create: () => new argusModule.Argus(new CommandRunner(spawn, printer)),
  },
  Argus: function Argus(commandRunner) {
    this.run = () => {
      const fileWatcher = new FileWatcher(printer);
      const commandBuilder = new CommandBuilder();
      const watchlist = (new Watchlist()).compileFrom(testFinder.getTestDir());

      fileWatcher.watchPhpFiles(watchlist, (pathToChangedFile) => {
        const testFilePath = testFinder.findTestFor(pathToChangedFile);
        const command = commandBuilder.buildFor(testFilePath);
        commandRunner.run(command);
      });

      return fileWatcher;
    };
  },
};

module.exports = argusModule;
