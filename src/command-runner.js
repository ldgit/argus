const moment = require('moment');
const spawnSync = require('child_process').spawnSync;

function CommandRunner(spawn, printer) {
  this.run = (commands) => {
    commands.forEach((command) => {
      printer.info(`[${getCurrentTime()}] ${command.command} "${command.args}"`);
      spawn(command.command, command.args, { stdio: 'inherit' });
    });
  };

  function getCurrentTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = {
  class: CommandRunner,
  getSynchronousImplementation: printer => new CommandRunner(spawnSync, printer),
};
