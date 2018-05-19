const chalk = require('chalk');

function createConsolePrinter(console) {
  return {
    info(text) {
      console.log(chalk.cyanBright(text));
    },
    notice(text) {
      console.log(chalk.yellowBright(text));
    },
    warning(text) {
      console.log(chalk.bgYellow.black(text));
    },
    error(text) {
      console.log(chalk.redBright(text));
    },
  };
}

function createNullPrinter() {
  return {
    info: () => {},
    warning: () => {},
    error: () => {},
    notice: () => {},
  };
}

module.exports = {
  consolePrinter: createConsolePrinter(console),
  nullPrinter: createNullPrinter(),
  createConsolePrinter,
};
