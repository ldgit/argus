module.exports = function (spawn) {
    this.run = function (command) {
        if(command.command !== '') {
            spawn(command.command, command.args, {stdio: 'inherit'});
        }
    };
}
