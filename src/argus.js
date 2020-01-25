const { runCommands } = require('./command-runner');
const { createWatcher } = require('./file-watcher');
const configureFindTestsFor = require('./test-finder');
const { buildForFilepaths } = require('./command-builder');
const { compileWatchlistFor } = require('./watchlist');
const readConfiguration = require('./configuration-reader');
const getCommandLineOptions = require('./command-line-options');
const { listenForUserInput, setLastRunCommands } = require('./../src/user-input-handler');

module.exports = {
  runArgus: configureRunArgus(runCommands, getCommandLineOptions(process.argv), process.stdin),
  configureRunArgus,
};

function configureRunArgus(runCommandsFunction, commandLineOptions, stdin) {
  return runArgus.bind(null, runCommandsFunction, commandLineOptions, stdin);
}

function runArgus(runCommandsFunction, commandLineOptions, stdin) {
  const configuration = readConfiguration(commandLineOptions.config);
  const findTestsFor = configureFindTestsFor(configuration.environments);
  const fileWatcher = createWatcher(configuration);
  const watchlist = compileWatchlistFor(configuration.environments);

  listenForUserInput(runCommandsFunction, stdin, configuration.environments);

  fileWatcher.watchFiles(watchlist, pathToChangedFile => {
    const testFilePaths = findTestsFor(pathToChangedFile);
    const commands = buildForFilepaths(testFilePaths);

    runCommandsFunction(commands);

    setLastRunCommands(commands);
  });

  return fileWatcher;
}
