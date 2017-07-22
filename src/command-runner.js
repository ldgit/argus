module.exports = function (spawn) {
    this.run = function (command) {
        spawn(command.command, command.args, {stdio: 'inherit'});
    };
}
