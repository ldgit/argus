const path = require('path');

module.exports = function CommandBuilder() {
  this.buildFor = testFilePath => ({
    command: testFilePath !== '' ? path.join('vendor', 'bin', 'phpunit') : '',
    args: [testFilePath],
  });
};
