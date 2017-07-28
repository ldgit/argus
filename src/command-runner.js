module.exports = function CommandRunner(spawn, printer) {
  this.run = (command) => {
    if (command.command !== '') {
      printer.info(`${command.command} "${command.args}"`);
      spawn(command.command, command.args, { stdio: 'inherit' });
    }
  };
};
