var fs = require('fs');

"use strict";

module.exports = function TestFinder() {
    var possibleTestDirectories = [
        'tests/',
        'tests/unit/',
        'test/',
        'test/unit/',
    ];

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