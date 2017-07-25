module.exports = function (spawn, printer) {
    this.run = function (command) {
        if(command.command !== '') {
            printer.info(command.command + ' "' + command.args + '"');
            spawn(command.command, command.args, {stdio: 'inherit'});
        }
    };
}
