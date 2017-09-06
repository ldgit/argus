const fs = require('fs');
const path = require('path');

module.exports = function TestFinder(environments) {
  this.findTestsFor = (filePath) => {
    const testPaths = [];
    const environmentsForFile = getEnvironmentsForFile(filePath);

    environmentsForFile.forEach((fileEnvironment) => {
      const possibleTestPath = getPossibleTestPath(filePath, fileEnvironment);

      if (fs.existsSync(possibleTestPath)) {
        testPaths.push({ path: possibleTestPath, environment: fileEnvironment });
      }
    });

    return testPaths;
  };

  function getPossibleTestPath(filePath, environment) {
    if (filePath.startsWith(environment.testDir)) {
      return filePath;
    }

    return [
      path.join(environment.testDir, pathWithoutExtensionAndSourceDir(filePath, environment)),
      `${environment.testNameSuffix}.${environment.extension}`,
    ].join('');
  }

  function getEnvironmentsForFile(filePath) {
    const foundEnvironments = [];
    const fileExtension = filePath.split('.').pop().toLowerCase();
    environments.forEach((environment) => {
      if (environment.extension === fileExtension) {
        foundEnvironments.push(environment);
      }
    });

    return foundEnvironments;
  }

  function pathWithoutExtensionAndSourceDir(filePath, environment) {
    return removeSourceDirFromPath(filePath, environment).split('.').slice(0, -1).join('.');
  }

  function removeSourceDirFromPath(filePath, environment) {
    return filePath.replace(environment.sourceDir, '');
  }
};
