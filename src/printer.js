const chalk = require('chalk');

const ConsolePrinter = function(console) {
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

const NullPrinter = function() {
    this.info = function(text) {};
    this.warning = function(text) {};
    this.error = function(text) {};
};

module.exports = {
    create: function() {
        return new ConsolePrinter(console);
    },
    createNull: function() {
        return new NullPrinter();
    },
    Printer: ConsolePrinter
};
