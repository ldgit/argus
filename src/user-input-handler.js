const { format, consolePrinter } = require('../src/printer');
const { buildCommandsToRunAllTests } = require('../src/command-builder');

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
    if (key.toLowerCase() === 'a') {
      runCommands(buildCommandsToRunAllTests(environments));
    }

    if (key.toLowerCase() === 'l') {
      printer.title('\nCommands list');
      printer.message(`  press ${format.yellow('r')} to rerun last test batch`);
      printer.message(`  press ${format.green('a')} to run all tests\n`);
    }

    if (key.toLowerCase() === 'r' && lastRunCommands !== null) {
      runCommands(lastRunCommands);
    }

    if (key === '\u0003') {
      processExit();
    }
  });
}
