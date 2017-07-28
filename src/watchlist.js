const glob = require('glob');
const fs = require('fs');

module.exports = function Watchlist() {
  this.compileFrom = (testsDir) => {
    const normalizedTestsDir = !testsDir.startsWith('./') ? `./${testsDir}` : testsDir;

    if (!fs.existsSync(normalizedTestsDir)) {
      throw new TypeError(`Test directory ${normalizedTestsDir} was not found`);
    }

    const locationsToWatch = [];
    const testsToWatch = glob.sync(`${normalizedTestsDir}/**/*Test.php`);

    testsToWatch.forEach((filepath) => {
      const fullFilepath = filepath.startsWith('./') ? filepath : `./${filepath}`;
      const sourceFilePath = ['./', fullFilepath.replace(normalizedTestsDir, '').replace('Test.php', '.php')].join('');

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
    const pathFragments = filepath.split('/');
    const filename = pathFragments.pop();
    const globifiedFilename = filename.replace(filename[0], `[${filename[0]}]`);

    return `${(pathFragments.join('/'))}/${globifiedFilename}`;
  }
};
