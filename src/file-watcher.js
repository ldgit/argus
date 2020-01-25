const fs = require('fs');
const fileWatcher = require('chokidar');
const _ = require('lodash');
const { consolePrinter } = require('./printer');

module.exports = {
  createWatcher: configureCreateWatcher.bind(null, consolePrinter, _.debounce),
  configureCreateWatcher,
};

function configureCreateWatcher(printer, debounce, configuration) {
  const { environments } = configuration;
  let watcher;

  return {
    watchFiles(watchlist, callback) {
      const filteredWatchlist = watchlist.filter(watchlistPath => {
        const deglobifiedPath = watchlistPath.replace('[', '').replace(']', '');
        return fs.existsSync(deglobifiedPath);
      });

      watcher = fileWatcher.watch(filteredWatchlist, {
        atomic: true,
        depth: 0,
      });

      // We debounce the change callback to avoid occasional double trigger
      watcher.on('change', debounce(callback, 100));
      watcher.on('ready', () => {
        printer.info(
          `Watching ${getFilesWatchedCount(environments, watcher.getWatched())} file(s)`,
        );
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

  Object.values(watched).forEach(files => {
    filesWatchedCount += files.filter(file =>
      supportedExtensions.includes(
        file
          .split('.')
          .pop()
          .toLowerCase(),
      ),
    ).length;
  });

  return filesWatchedCount;
}
