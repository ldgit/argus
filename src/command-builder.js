module.exports = function CommandBuilder(environments) {
  this.buildFor = (testFilepath) => {
    const command = { command: '', args: [] };

    if (environments.length === 0) {
      return command;
    }

    environments.forEach((environment) => {
      if (getFileExtension(testFilepath) === environment.extension) {
        command.command = testFilepath !== '' ? environment.testRunnerCommand : '';
        command.args = [testFilepath].concat(environment.arguments);
      }
    });

    return command;
  };

  function getFileExtension(filepath) {
    return filepath.split('.').pop();
  }
};
