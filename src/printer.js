const chalk = require('chalk');

const ConsolePrinter = function ConsolePrinter(console) {
  const log = console.log;

  this.info = (text) => {
    log(chalk.cyanBright(text));
  };

  this.notice = (text) => {
    log(chalk.yellowBright(text));
  };

  this.warning = (text) => {
    log(chalk.bgYellow.black(text));
  };

  this.error = (text) => {
    log(chalk.redBright(text));
  };
};

const NullPrinter = function NullPrinter() {
  this.info = () => {};
  this.warning = () => {};
  this.error = () => {};
};

module.exports = {
  create: () => new ConsolePrinter(console),
  createNull: () => new NullPrinter(),
  Printer: ConsolePrinter,
};
