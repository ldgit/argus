const fileWatcher = require('chokidar');
const fs = require('fs');

module.exports = function Watcher(printer) {
  let watcher;

  this.watchPhpFiles = (watchlist, callback) => {
    if (typeof watchlist === 'object') {
      watchlist.forEach((watchlistPath) => {
        const deglobifiedPath = watchlistPath.replace('[', '').replace(']', '');
        if (!fs.existsSync(deglobifiedPath)) {
          printer.warning(`File not found: "${deglobifiedPath}"`);
        }
      });
    } else if (!fs.existsSync(watchlist)) {
      throw new TypeError();
    }

    const fullWatchlist = typeof watchlist === 'string' ? `${watchlist}/**/*.php` : watchlist;

    watcher = fileWatcher.watch(fullWatchlist, {
      ignored: /vendor/,
    });
    watcher.on('change', callback);
  };

  this.close = () => {
    if (watcher) {
      watcher.close();
    }
  };
};
