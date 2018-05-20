const { runCommands } = require('./command-runner');
const { createWatcher } = require('./file-watcher');
const configureFindTestsFor = require('./test-finder');
const CommandBuilder = require('./command-builder');
const { compileWatchlistFor } = require('./watchlist');
const readConfiguration = require('./configuration-reader');
const getCommandLineOptions = require('./command-line-options');

module.exports = {
  runArgus: configureRunArgus(runCommands, getCommandLineOptions(process.argv)),
  configureRunArgus,
};

function configureRunArgus(runCommandsFunction, commandLineOptions) {
  return runArgus.bind(null, runCommandsFunction, commandLineOptions);
}

function runArgus(runCommandsFunction, commandLineOptions) {
  const configuration = readConfiguration(commandLineOptions.config);
  const findTestsFor = configureFindTestsFor(configuration.environments);
  const fileWatcher = createWatcher(configuration);
  const commandBuilder = new CommandBuilder();
  const watchlist = compileWatchlistFor(configuration.environments);

  fileWatcher.watchFiles(watchlist, (pathToChangedFile) => {
    const testFilePaths = findTestsFor(pathToChangedFile);
    const commands = commandBuilder.buildFor(testFilePaths);

    runCommandsFunction(commands);
  });

  return fileWatcher;
}
