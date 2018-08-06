const chalk = require('chalk');

function createNullPrinter() {
  return {
    info: () => {},
    warning: () => {},
    error: () => {},
    notice: () => {},
    message: () => {},
    title: () => {},
  };
}

const format = {
  asTitle(text) {
    return chalk.whiteBright.underline(text);
  },
  red(text) {
    return chalk.redBright(text);
  },
  asWarning(text) {
    return chalk.bgYellow.black(text);
  },
  blue(text) {
    return chalk.cyanBright(text);
  },
  yellow(text) {
    return chalk.yellowBright(text);
  },
};

function createConsolePrinter(console) {
  return {
    info(text) {
      console.log(format.blue(text));
    },
    notice(text) {
      console.log(format.yellow(text));
    },
    warning(text) {
      console.log(format.asWarning(text));
    },
    error(text) {
      console.log(format.red(text));
    },
    message(text) {
      console.log(text);
    },
    title(text) {
      console.log(format.asTitle(text));
    },
  };
}

module.exports = {
  consolePrinter: createConsolePrinter(console),
  nullPrinter: createNullPrinter(),
  createConsolePrinter,
  format,
};
