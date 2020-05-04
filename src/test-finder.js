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

function getPossibleTestPath(filePath, { testNameSuffix, testDir, sourceDir, extension }) {
  const normalizedFilePath = path.normalize(filePath).replace(/\\/g, '/');
  const normalizedTestDir = path.normalize(testDir).replace(/\\/g, '/');

  if (
    isInTestDir(normalizedFilePath, normalizedTestDir) &&
    isTestFile(normalizedFilePath, testNameSuffix)
  ) {
    return path.join(normalizedFilePath);
  }

  return [
    path.join(testDir, pathWithoutExtensionAndSourceDir(filePath, sourceDir)),
    `${testNameSuffix}.${extension}`,
  ].join('');
}

function isInTestDir(filePath, testDir) {
  return filePath.startsWith(testDir);
}

function isTestFile(filePath, testSuffix) {
  return getWithoutExtension(filePath).endsWith(testSuffix);
}

function pathWithoutExtensionAndSourceDir(filePath, sourceDir) {
  return getWithoutExtension(removeSourceDirFromPath(filePath, sourceDir));
}

function getWithoutExtension(filePath) {
  return filePath.split('.').slice(0, -1).join('.');
}

function removeSourceDirFromPath(filePath, sourceDir) {
  return filePath.replace(sourceDir, '');
}
