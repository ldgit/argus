const fileWatcher = require('chokidar');
const fs = require('fs');

module.exports = function Watcher(printer) {
  let watcher;
  const filteredWatchlist = [];

  this.watchPhpFiles = (watchlist, callback) => {
    if (typeof watchlist === 'object') {
      watchlist.forEach((watchlistPath) => {
        const deglobifiedPath = watchlistPath.replace('[', '').replace(']', '');
        if (!fs.existsSync(deglobifiedPath)) {
          printer.warning(`File not found: "${deglobifiedPath}"`);
        } else {
          filteredWatchlist.push(watchlistPath);
        }
      });
    } else if (!fs.existsSync(watchlist)) {
      throw new TypeError();
    }

    const fullWatchlist = typeof watchlist === 'string' ? `${watchlist}/**/*.php` : filteredWatchlist;

    watcher = fileWatcher.watch(fullWatchlist, {
      ignored: /vendor/,
    });
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
    Object.keys(watched).forEach((pathOrFile) => {
      if (pathOrFile.endsWith('.php')) {
        filesWatchedCount += 1;
      }
    });

    return filesWatchedCount;
  }
};
