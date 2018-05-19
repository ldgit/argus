const spawnSync = require('child_process').spawnSync;
const format = require('date-fns/format');
const { consolePrinter } = require('../src/printer');

function configureRunCommands(spawn, printer, commands) {
  commands.forEach((command) => {
    printer.info(`[${getCurrentTime()}] ${command.command} ${command.args.join(' ')}`);
    spawn(command.command, command.args, { stdio: 'inherit' });
  });
}

function getCurrentTime() {
  return format(new Date(), 'YYYY-MM-DD HH:mm:ss');
}

module.exports = {
  configureRunCommands,
  runCommands: configureRunCommands.bind(null, spawnSync, consolePrinter),
};
