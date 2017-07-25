const chalk = require('chalk');

module.exports = function(console) {
    var log = console.log;

    this.info = function(text) {
        log(chalk.cyanBright(text));
    };

    this.warning = function(text) {
        log(chalk.yellowBright(text));
    };

    this.error = function(text) {
        log(chalk.redBright(text));
    };
};