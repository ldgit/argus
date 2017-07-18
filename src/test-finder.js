var fs = require('fs');

module.exports = function TestFinder(testsDirectoryPath = 'tests/') {
    this.findTestFor = function(filePath) {
        var testPath = testsDirectoryPath + getPathWithoutExtension(filePath) + 'Test.php';

        if(!fs.existsSync(testPath)) {
            return '';            
        }

        return testPath;
    };

    function getPathWithoutExtension(filePath) {
        return filePath.split('.').slice(0, -1).join('.');
    };
}