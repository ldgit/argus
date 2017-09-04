const printer = require('./printer').create();
const syncCommandRunner = require('./command-runner').getSynchronousImplementation(printer);
const FileWatcher = require('./file-watcher');
const TestFinder = require('./test-finder');
const CommandBuilder = require('./command-builder');
const Watchlist = require('./watchlist');
const ConfigurationReader = require('./configuration-reader');
const CommandLineOptions = require('./command-line-options');

const argusModule = {
  factory: {
    create: () => new argusModule.Argus(syncCommandRunner, CommandLineOptions(process.argv)),
  },
  Argus: function Argus(commandRunner, commandLineOptions) {
    this.run = () => {
      const configuration = new ConfigurationReader().read(commandLineOptions.config);
      const testFinder = new TestFinder(configuration.environments);
      const fileWatcher = new FileWatcher(printer, configuration.environments);
      const commandBuilder = new CommandBuilder(configuration.environments);
      const watchlist = (new Watchlist(printer)).compileFor(configuration.environments);

      fileWatcher.watchPhpFiles(watchlist, (pathToChangedFile) => {
        const testFilePaths = testFinder.findTestsFor(pathToChangedFile);
        const commands = commandBuilder.buildFor(testFilePaths);

        commandRunner.run(commands);
      });

      return fileWatcher;
    };
  },
};

module.exports = argusModule;
