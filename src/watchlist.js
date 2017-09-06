const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function Watchlist(printer) {
  this.compileFor = (environments) => {
    const locationsToWatch = [];

    environments.forEach((environment) => {
      const testNameSuffix = environment.testNameSuffix;
      const extension = environment.extension;

      if (!fs.existsSync(path.normalize(environment.testDir))) {
        printer.error(`Test directory ${path.normalize(environment.testDir)} was not found`);
      }

      const testsToWatch = glob.sync(`${path.normalize(environment.testDir)}/**/*${testNameSuffix}.${extension}`);

      testsToWatch.forEach((filepath) => {
        const sourceFilePath = getSourcePathFromTestPath(filepath, environment);

        locationsToWatch.push(globify(filepath));
        locationsToWatch.push(globify(sourceFilePath));
      });
    });

    return removeDuplicates(locationsToWatch);
  };

  function getSourcePathFromTestPath(testPath, environment) {
    return path.join('./', testPath
      .replace(path.normalize(environment.testDir), `/${environment.sourceDir}`)
      .replace(`${environment.testNameSuffix}.${environment.extension}`, `.${environment.extension}`));
  }

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

  function removeDuplicates(array) {
    return [...new Set(array)];
  }
};
