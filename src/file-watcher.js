var fileWatcher = require('chokidar');
var fs = require('fs');

module.exports = function Watcher() {
    var watcher;

    this.watchPhpFiles = function (watchlist, callback) {
        if (typeof watchlist === 'object') {
            watchlist.forEach(function(watchlistPath){
                if (!fs.existsSync(watchlistPath)) {
                    throw new TypeError();     
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
