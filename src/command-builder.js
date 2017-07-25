module.exports = function () {
    this.buildFor = function(testFilePath) {
        return {
            command: testFilePath !== '' ? 'vendor/bin/phpunit' : '',
            args: [testFilePath]
        };
    };
};
