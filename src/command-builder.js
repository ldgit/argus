module.exports = function buildForFilepaths(testFilepaths) {
  if (testFilepaths.length < 1) {
    return [];
  }

  const commands = [];
  testFilepaths.forEach((testFile) => {
    commands.push({
      command: testFile.environment.testRunnerCommand.command,
      args: testFile.environment.testRunnerCommand.arguments.concat([testFile.path]),
    });
  });

  return commands;
};
