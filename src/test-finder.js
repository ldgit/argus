const fs = require('fs');
const path = require('path');

module.exports = function TestFinder() {
  const possibleTestDirectories = [
    path.join('tests', 'unit'),
    path.join('test', 'unit'),
    path.join('tests'),
    path.join('test'),
  ];

  this.getTestDir = () => {
    let testDirPath = '';
    possibleTestDirectories.every((possibleTestsDirPath) => {
      if (fs.existsSync(possibleTestsDirPath)) {
        testDirPath = possibleTestsDirPath;
        return false; // ie. break
      }

      return true;
    });

    if (testDirPath === '') {
      throw new Error('Test directory not found, looked in ', possibleTestDirectories.join(', '));
    }

    return testDirPath;
  };

  this.findTestFor = (filePath) => {
    let testPath = '';

    possibleTestDirectories.every((testsDirectoryPath) => {
      const possibleTestPath = getPossibleTestPath(filePath, testsDirectoryPath);

      if (fs.existsSync(possibleTestPath)) {
        testPath = possibleTestPath;
        return false; // ie. break
      }

      return true;
    });

    return testPath;
  };

  function getPossibleTestPath(filePath, testsDirectoryPath) {
    if (filePath.startsWith(testsDirectoryPath)) {
      return filePath;
    }

    return [path.join(testsDirectoryPath, getPathWithoutExtension(filePath)), 'Test.php'].join('');
  }

  function getPathWithoutExtension(filePath) {
    return filePath.split('.').slice(0, -1).join('.');
  }
};
