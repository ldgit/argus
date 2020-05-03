const fs = require('fs');
const path = require('path');

module.exports = function configureFindTestsFor(environments) {
  return findTestsFor.bind(null, environments);
};

function findTestsFor(environments, filePath) {
  return getEnvironmentsForFile(filePath, environments)
    .map(fileEnvironment => ({
      path: getPossibleTestPath(filePath, fileEnvironment),
      environment: fileEnvironment,
    }))
    .filter(testPath => fs.existsSync(testPath.path));
}

function getPossibleTestPath(filePath, environment) {
  const normalizedFilePath = path.normalize(filePath).replace(/\\/g, '/');
  const normalizedTestDir = path.normalize(environment.testDir).replace(/\\/g, '/');

  if (normalizedFilePath.startsWith(normalizedTestDir)) {
    return path.join(normalizedFilePath);
  }

  return [
    path.join(environment.testDir, pathWithoutExtensionAndSourceDir(filePath, environment)),
    `${environment.testNameSuffix}.${environment.extension}`,
  ].join('');
}

function getEnvironmentsForFile(filePath, environments) {
  const foundEnvironments = [];
  const fileExtension = filePath.split('.').pop().toLowerCase();
  environments.forEach(environment => {
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
