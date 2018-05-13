const printer = require('./printer').create();
const { runCommands } = require('./command-runner');
const FileWatcher = require('./file-watcher');
const TestFinder = require('./test-finder');
const CommandBuilder = require('./command-builder');
const { compileWatchlistFor } = require('./watchlist');
const ConfigurationReader = require('./configuration-reader');
const CommandLineOptions = require('./command-line-options');

const argusModule = {
  factory: {
    create: () => new argusModule.Argus(runCommands, CommandLineOptions(process.argv)),
  },
  Argus: function Argus(runCommandsFunction, commandLineOptions) {
    this.run = () => {
      const configuration = new ConfigurationReader().read(commandLineOptions.config);
      const testFinder = new TestFinder(configuration.environments);
      const fileWatcher = new FileWatcher(printer, configuration);
      const commandBuilder = new CommandBuilder();
      const watchlist = compileWatchlistFor(configuration.environments);

      fileWatcher.watchFiles(watchlist, (pathToChangedFile) => {
        const testFilePaths = testFinder.findTestsFor(pathToChangedFile);
        const commands = commandBuilder.buildFor(testFilePaths);

        runCommandsFunction(commands);
      });

      return fileWatcher;
    };
  },
};

module.exports = argusModule;
