var fileWatcher = require('chokidar');
var fs = require('fs');

module.exports = function Watcher(printer) {
    var watcher;

    this.watchPhpFiles = function (watchlist, callback) {
        if (typeof watchlist === 'object') {
            watchlist.forEach(function(watchlistPath){
                var deglobifiedPath = watchlistPath.replace('[', '').replace(']', '');
                if (!fs.existsSync(deglobifiedPath)) {
                    printer.warning('File not found: "' + deglobifiedPath + '"');
                } 
            });
        } else if (!fs.existsSync(watchlist)) {
            throw new TypeError();
        }

        var fullWatchlist = typeof watchlist === 'string' ? watchlist + '/**/*.php' : watchlist;

        watcher = fileWatcher.watch(fullWatchlist, {
            ignored:  /vendor/
        });
        watcher.on('change', callback);
    };

    this.close = function() {
        if (watcher) {
            watcher.close();
        }
    };
};
