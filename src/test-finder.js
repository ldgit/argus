var fs = require('fs');

"use strict";

module.exports = function TestFinder() {
    var possibleTestDirectories = [
        'tests/unit/',
        'test/unit/',
        'tests/',
        'test/',
    ];

    this.getTestDir = function() {
        var testDirPath = '';
        possibleTestDirectories.every(function(possibleTestsDirPath) {
            if(fs.existsSync(possibleTestsDirPath)) {
                testDirPath = possibleTestsDirPath;
                return false; // ie. break
            }

            return true;
        });

        if('' === testDirPath)
            throw new Error('Test directory not found, looked in ', possibleTestDirectories.join(', '));

        return testDirPath;
    };

    this.findTestFor = function(filePath) {
        var testPath = '';

        possibleTestDirectories.every(function(testsDirectoryPath) {
            var possibleTestPath = getPossibleTestPath(filePath, testsDirectoryPath);

            if(fs.existsSync(possibleTestPath)) {
                testPath = possibleTestPath;
                return false; // ie. break
            }

            return true;
        });

        return testPath;
    };

    function getPossibleTestPath(filePath, testsDirectoryPath) {
        if(filePath.startsWith(testsDirectoryPath))
            return filePath;

        return testsDirectoryPath + getPathWithoutExtension(filePath) + 'Test.php';
    }

    function getPathWithoutExtension(filePath) {
        return filePath.split('.').slice(0, -1).join('.');
    };
}