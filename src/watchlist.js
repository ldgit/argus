const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function Watchlist() {
  this.compileFrom = (testsDir) => {
    const normalizedTestsDir = path.normalize(testsDir);

    if (!fs.existsSync(normalizedTestsDir)) {
      throw new TypeError(`Test directory ${normalizedTestsDir} was not found`);
    }

    const locationsToWatch = [];
    const testsToWatch = glob.sync(`${normalizedTestsDir}/**/*Test.php`);

    testsToWatch.forEach((filepath) => {
      const sourceFilePath = path.join('./', filepath.replace(normalizedTestsDir, '').replace('Test.php', '.php'));

      locationsToWatch.push(globify(filepath));
      locationsToWatch.push(globify(sourceFilePath));
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
    const pathFragments = filepath.split(path.sep);
    const filename = pathFragments.pop();
    const globifiedFilename = filename.replace(filename[0], `[${filename[0]}]`);

    return path.join(...pathFragments, globifiedFilename);
  }
};
