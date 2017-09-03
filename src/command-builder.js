module.exports = function CommandBuilder(environments) {
  this.buildFor = (testFilepaths) => {
    testFilepaths = testFilepaths.filter(String);
    if (testFilepaths.length < 1 || environments.length === 0) {
      return [];
    }

    const commands = [];
    testFilepaths.forEach((testFilepath) => {
      environments.forEach((environment) => {
        if (getFileExtension(testFilepath) === environment.extension) {
          commands.push({
            command: testFilepath !== '' ? environment.testRunnerCommand : '',
            args: [testFilepath].concat(environment.arguments),
          });
        }
      });
    });

    return commands;
  };

  function getFileExtension(filepath) {
    return filepath.split('.').pop();
  }
};
