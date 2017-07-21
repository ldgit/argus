module.exports = function (spawn, logger) {
    this.run = function (command) {
        spawn(command.command, command.args, {stdio: 'inherit'});
    };
}
