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

            locationsToWatch.push(globify(fullFilepath));
            locationsToWatch.push(globify(sourceFilePath.replace('//', '/')));
        });

        return locationsToWatch;
    };

    /**
     * Converts normal filepath into glob for that filepath.
     * 
     * @param  {string} filepath 
     * @return {string} first letter of the filename in the path is wrapped in squared brackets
     */
    function globify(filepath) {
        return wrapFirstLetterOfTheFileNameInSquareBrackets(filepath);
    }

    function wrapFirstLetterOfTheFileNameInSquareBrackets(filepath) {
        var pathFragments = filepath.split('/');
        var filename = pathFragments.pop();
        filename = filename.replace(filename[0], '[' + filename[0] + ']');

        return pathFragments.join('/') + '/' + filename;
    }
};
