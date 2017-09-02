const fileWatcher = require('chokidar');
const fs = require('fs');

module.exports = function Watcher(printer, environments) {
  let watcher;
  const filteredWatchlist = [];

  this.watchPhpFiles = (watchlist, callback) => {
    watchlist.forEach((watchlistPath) => {
      const deglobifiedPath = watchlistPath.replace('[', '').replace(']', '');
      if (!fs.existsSync(deglobifiedPath)) {
        printer.warning(`File not found: "${deglobifiedPath}"`);
      } else {
        filteredWatchlist.push(watchlistPath);
      }
    });

    watcher = fileWatcher.watch(filteredWatchlist);
    watcher.on('change', callback);
    watcher.on('ready', () => {
      printer.info(`Watching ${getFilesWatchedCount(watcher.getWatched())} file(s)`);
    });
  };

  this.close = () => {
    if (watcher) {
      watcher.close();
    }
  };

  this.on = (event, callback) => {
    watcher.on(event, callback);
  };

  function getFilesWatchedCount(watched) {
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
};
