module.exports = function buildForFilepaths(testFilepaths) {
  if (testFilepaths.length < 1) {
    return [];
  }

  const commands = [];
  testFilepaths.forEach((testFile) => {
    commands.push({
      command: testFile.path !== '' ? testFile.environment.testRunnerCommand : '',
      args: testFile.environment.arguments.concat([testFile.path]),
    });
  });

  return commands;
};
