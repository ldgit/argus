const fs = require('fs');
const path = require('path');

module.exports = function TestFinder(environments) {
  this.findTestFor = (filePath) => {
    const testPaths = [];

    getPossibleTestDirectories(filePath).forEach((testsDirectoryPath) => {
      const possibleTestPath = getPossibleTestPath(filePath, testsDirectoryPath);

      if (fs.existsSync(possibleTestPath)) {
        testPaths.push(possibleTestPath);
      }
    });

    return testPaths;
  };

  function getPossibleTestDirectories(filePath) {
    return getEnvironmentsForFile(filePath).map(environment => environment.testDir);
  }

  function getPossibleTestPath(filePath, testsDirectoryPath) {
    if (filePath.startsWith(testsDirectoryPath)) {
      return filePath;
    }

    const foundEnvironments = getEnvironmentsForFile(filePath);

    let foundEnvironment;
    foundEnvironments.forEach((environment) => {
      if (environment.testDir === testsDirectoryPath) {
        foundEnvironment = environment;
      }
    });

    return [
      path.join(testsDirectoryPath, getPathWithoutExtension(filePath)),
      `${foundEnvironment.testNameSuffix}.${foundEnvironment.extension}`,
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

  function getPathWithoutExtension(filePath) {
    return filePath.split('.').slice(0, -1).join('.');
  }
};
