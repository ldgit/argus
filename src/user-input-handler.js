
const { format, consolePrinter } = require('../src/printer');

module.exports = {
  listenForUserInput: unconfiguredListenForUserInput.bind(null, process.exit, consolePrinter),
  unconfiguredListenForUserInput,
  setLastRunCommands,
};

let lastRunCommands = null;

function setLastRunCommands(lastRunCommandBatch) {
  lastRunCommands = lastRunCommandBatch;
}

function unconfiguredListenForUserInput(processExit, printer, runCommands, stdin, environments) {
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.resume();

  stdin.on('data', (key) => {
    if (key === 'a') {
      const commandsToRunAllTests = environments
        .map(environment => (environment.runAllTestsCommand
          ? { command: environment.runAllTestsCommand.command, args: environment.runAllTestsCommand.arguments }
          : { command: environment.testRunnerCommand, args: environment.arguments }
        ))
        .reduce((accumulator, currentCommand) => {
          if (!arrayContainsObject(accumulator, currentCommand)) {
            accumulator.push(currentCommand);
          }
          return accumulator;
        }, []);

      runCommands(commandsToRunAllTests);
    }

    if (key === 'l') {
      printer.title('\nCommands list');
      printer.message(`  press ${format.yellow('r')} to rerun last test batch`);
      printer.message(`  press ${format.green('a')} to run all tests\n`);
    }

    if (key === 'r' && lastRunCommands !== null) {
      runCommands(lastRunCommands);
    }

    if (key === '\u0003') {
      processExit();
    }
  });
}

function arrayContainsObject(array, objectNeedle) {
  return array.map(object => JSON.stringify(object)).includes(JSON.stringify(objectNeedle));
}
