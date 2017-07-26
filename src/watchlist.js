var glob = require('glob');
var fs = require('fs');

module.exports = function () {
    this.compileFrom = function(testsDir) {
        if (!testsDir.startsWith('./')) 
            testsDir = './' + testsDir;
        if (!fs.existsSync(testsDir))
            throw new TypeError('Test directory ' + testsDir + 'was not found');

        var locationsToWatch = [];
        var testsToWatch = glob.sync(testsDir + '/**/*Test.php');

        testsToWatch.forEach(function(filepath) {
            var fullFilepath = filepath.startsWith('./') ? filepath : './' + filepath;
            var sourceFilePath = './' + fullFilepath.replace(testsDir, '').replace('Test.php', '.php');

            locationsToWatch.push(fullFilepath);
            locationsToWatch.push(sourceFilePath.replace('//', '/'));
        });

        return locationsToWatch;
    };
};
