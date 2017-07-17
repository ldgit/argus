var fileWatcher = require('chokidar');
var fs = require('fs');

module.exports = function Watcher() {
    this.watchPhpFiles = function (dirpath, callback) {
        if (!fs.existsSync(dirpath)) {
            throw new TypeError();
        }

        watcher = fileWatcher.watch(dirpath);
        watcher.on('change', callback);
    };
};

