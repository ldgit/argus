const spawnSync = require('child_process').spawnSync;
const format = require('date-fns/format');

function CommandRunner(spawn, printer) {
  this.run = (commands) => {
    commands.forEach((command) => {
      printer.info(`[${getCurrentTime()}] ${command.command} ${command.args.join(' ')}`);
      spawn(command.command, command.args, { stdio: 'inherit' });
    });
  };

  function getCurrentTime() {
    return format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = {
  class: CommandRunner,
  getSynchronousImplementation: printer => new CommandRunner(spawnSync, printer),
};
