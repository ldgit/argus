const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { consolePrinter } = require('./printer');

module.exports = {
  configureCompileWatchlist,
  compileWatchlistFor: configureCompileWatchlist.bind(null, consolePrinter),
};

function configureCompileWatchlist(printer, environments) {
  const locationsToWatch = [];

  environments.forEach(environment => {
    const { testNameSuffix, extension } = environment;

    if (!fs.existsSync(path.normalize(environment.testDir))) {
      printer.error(`Test directory ${path.normalize(environment.testDir)} was not found`);
    }

    const testsToWatch = glob.sync(
      `${path.normalize(environment.testDir)}/**/*${testNameSuffix}.${extension}`,
    );
    testsToWatch.forEach(filepath => {
      const sourceFilePath = getSourcePathFromTestPath(filepath, environment);

      if (!fs.existsSync(sourceFilePath)) {
        printer.notice(`Source file not found for test: "${filepath}"`);
      } else {
        locationsToWatch.push(sourceFilePath);
      }

      locationsToWatch.push(path.join(filepath));
    });
  });

  return removeDuplicates(locationsToWatch);
}

function getSourcePathFromTestPath(testPath, environment) {
  return path.join(
    './',
    path
      .normalize(testPath)
      .replace(path.normalize(environment.testDir), path.normalize(`/${environment.sourceDir}`))
      .replace(
        `${environment.testNameSuffix}.${environment.extension}`,
        `.${environment.extension}`,
      ),
  );
}

function removeDuplicates(array) {
  return [...new Set(array)];
}
