const spawnSync = require('child_process').spawnSync;
const formatDate = require('date-fns/format');
const { consolePrinter, format } = require('../src/printer');

function configureRunCommands(spawn, printer) {
  return runCommands.bind(null, spawn, printer);
}

function runCommands(spawn, printer, commands) {
  commands.forEach((command) => {
    printer.info(`[${getCurrentTime()}] ${command.command} ${command.args.join(' ')}`);
    spawn(command.command, command.args, { stdio: 'inherit' });
  });

  printer.message(`\nPress ${format.red('l')} to list available commands\n`);
}

function getCurrentTime() {
  return formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
}

module.exports = {
  configureRunCommands,
  runCommands: configureRunCommands(spawnSync, consolePrinter),
};
