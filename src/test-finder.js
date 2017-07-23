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
            var possibleTestPath = testsDirectoryPath + getPathWithoutExtension(filePath) + 'Test.php';

            if(fs.existsSync(possibleTestPath)) {
                testPath = possibleTestPath;
                return false; // ie. break
            }

            return true;
        });

        return testPath;
    };

    function getPathWithoutExtension(filePath) {
        return filePath.split('.').slice(0, -1).join('.');
    };
}