const CommandRunner = require('./command-runner');
const FileWatcher = require('./file-watcher');
const TestFinder = require('./test-finder');
const CommandBuilder = require('./command-builder');
const Watchlist = require('./watchlist');
const spawn = require('child_process').spawn;
const ConfigurationReader = require('./configuration-reader');
const printer = require('./printer').create();

const testFinder = new TestFinder();

const argusModule = {
  factory: {
    create: () => new argusModule.Argus(new CommandRunner(spawn, printer)),
  },
  Argus: function Argus(commandRunner) {
    this.run = () => {
      const fileWatcher = new FileWatcher(printer);
      const configuration = new ConfigurationReader().read('./argus.config.js');
      const commandBuilder = new CommandBuilder(configuration.environments);
      const watchlist = (new Watchlist(printer)).compileFor(configuration.environments);

      fileWatcher.watchPhpFiles(watchlist, (pathToChangedFile) => {
        const testFilePaths = testFinder.findTestsFor(pathToChangedFile);
        const command = commandBuilder.buildFor(testFilePaths);
        commandRunner.run(command);
      });

      return fileWatcher;
    };
  },
};

module.exports = argusModule;
