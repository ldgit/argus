const fs = require('fs');
const path = require('path');

module.exports = function configureFindTestsFor(environments) {
  return findTestsFor.bind(null, environments);
};

function findTestsFor(environments, filePath) {
  const testPaths = [];
  const environmentsForFile = getEnvironmentsForFile(filePath, environments);

  environmentsForFile.forEach((fileEnvironment) => {
    const possibleTestPath = getPossibleTestPath(filePath, fileEnvironment);

    if (fs.existsSync(possibleTestPath)) {
      testPaths.push({ path: possibleTestPath, environment: fileEnvironment });
    }
  });

  return testPaths;
}

function getPossibleTestPath(filePath, environment) {
  if (filePath.startsWith(environment.testDir)) {
    return path.join(filePath);
  }

  return [
    path.join(environment.testDir, pathWithoutExtensionAndSourceDir(filePath, environment)),
    `${environment.testNameSuffix}.${environment.extension}`,
  ].join('');
}

function getEnvironmentsForFile(filePath, environments) {
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
