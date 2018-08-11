const chalk = require('chalk');

function createPrinterSpy() {
  const messages = [];

  return {
    info: text => messages.push({ text, type: 'info' }),
    warning: text => messages.push({ text, type: 'warning' }),
    error: text => messages.push({ text, type: 'error' }),
    notice: text => messages.push({ text, type: 'notice' }),
    message: text => messages.push({ text, type: 'message' }),
    title: text => messages.push({ text, type: 'title' }),
    getPrintedMessages: () => messages,
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
  green(text) {
    return chalk.greenBright(text);
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
  createPrinterSpy,
  createConsolePrinter,
  format,
};
