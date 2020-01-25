const formatDate = require('date-fns/format');
const crossSpawn = require('cross-spawn');
const { consolePrinter, format } = require('../src/printer');

function configureRunCommands(spawn, printer, stdin, platform) {
  return runCommands.bind(null, spawn, printer, stdin, platform);
}

function runCommands(spawn, printer, stdin, platform, commands) {
  if (platform !== 'win32') {
    stdin.setRawMode(false);
  }

  commands.forEach((command) => {
    printer.info(`[${getCurrentTime()}] ${command.command} ${command.args.join(' ')}`);
    spawn(command.command, command.args, { stdio: 'inherit' });
  });

  if (platform !== 'win32') {
    stdin.setRawMode(true);
  }

  printer.message(`\nPress ${format.red('l')} to list available commands\n`);
}

function getCurrentTime() {
  return formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
}

module.exports = {
  configureRunCommands,
  runCommands: configureRunCommands(crossSpawn.sync, consolePrinter, process.stdin, process.platform),
};
