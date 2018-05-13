const fileWatcher = require('chokidar');
const fs = require('fs');
const consolePrinter = require('./printer').create();

module.exports = {
  createWatcher: configureCreateWatcher.bind(null, consolePrinter),
  configureCreateWatcher,
};

function configureCreateWatcher(printer, configuration) {
  const environments = configuration.environments;
  let watcher;

  return {
    watchFiles(watchlist, callback) {
      const filteredWatchlist = watchlist.filter((watchlistPath) => {
        const deglobifiedPath = watchlistPath.replace('[', '').replace(']', '');
        return fs.existsSync(deglobifiedPath);
      });

      watcher = fileWatcher.watch(filteredWatchlist, {
        atomic: true,
        depth: 0,
      });
      watcher.on('change', callback);
      watcher.on('ready', () => {
        printer.info(`Watching ${getFilesWatchedCount(environments, watcher.getWatched())} file(s)`);
        if (!configuration.configFileFound) {
          printer.warning('Configuration file not found, will use default configuration.');
        }
      });
    },
    on(event, callback) {
      watcher.on(event, callback);
    },
    close() {
      if (watcher) {
        watcher.close();
      }
    },
  };
}

function getFilesWatchedCount(environments, watched) {
  let filesWatchedCount = 0;
  const supportedExtensions = environments.map(environment => environment.extension);

  Object.keys(watched).forEach((pathOrFile) => {
    const fileExtension = pathOrFile.split('.').pop().toLowerCase();
    if (supportedExtensions.includes(fileExtension)) {
      filesWatchedCount += 1;
    }
  });

  return filesWatchedCount;
}
