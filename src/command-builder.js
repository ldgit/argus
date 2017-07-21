module.exports = function () {
    this.buildFor = function(testFilePath) {
        return {
            command: 'vendor/bin/phpunit',
            args: [testFilePath]
        };
    };
};
