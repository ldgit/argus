const moment = require('moment');

module.exports = function CommandRunner(spawn, printer) {
  this.run = (command) => {
    if (command.command !== '') {
      printer.info(`[${getCurrentTime()}] ${command.command} "${command.args}"`);
      spawn(command.command, command.args, { stdio: 'inherit' });
    }
  };

  function getCurrentTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
};
