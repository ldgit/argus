module.exports = function CommandBuilder() {
  this.buildFor = testFilePath => ({
    command: testFilePath !== '' ? 'vendor/bin/phpunit' : '',
    args: [testFilePath],
  });
};
