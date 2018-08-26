function buildForFilepaths(testFilepaths) {
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
}

function buildCommandsToRunAllTests(environments) {
  return environments
    .map(environment => (environment.runAllTestsCommand
      ? { command: environment.runAllTestsCommand.command, args: environment.runAllTestsCommand.arguments }
      : { command: environment.testRunnerCommand.command, args: environment.testRunnerCommand.arguments }
    ))
    .reduce((accumulator, currentCommand) => {
      if (!arrayContainsObject(accumulator, currentCommand)) {
        accumulator.push(currentCommand);
      }
      return accumulator;
    }, []);
}

function arrayContainsObject(array, objectNeedle) {
  return array.map(object => JSON.stringify(object)).includes(JSON.stringify(objectNeedle));
}

module.exports = { buildForFilepaths, buildCommandsToRunAllTests };
