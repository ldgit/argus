const assert = require('assert');
const chalk = require('chalk');
const { createConsolePrinter } = require('../src/printer');

describe('printer', () => {
  let printer;
  let consoleSpy;

  function ConsoleSpy() {
    const logs = [];
    this.log = (text) => {
      logs.push(text);
    };

    this.getLogs = () => logs;
  }

  beforeEach(() => {
    consoleSpy = new ConsoleSpy();
    printer = createConsolePrinter(consoleSpy);
  });

  it('info method should print text in bright cyan color', () => {
    printer.info('info text');
    assert.equal(consoleSpy.getLogs()[0], chalk.cyanBright('info text'));
  });

  it('notice method should print text in bright yellow color', () => {
    printer.notice('notice text');
    assert.equal(consoleSpy.getLogs()[0], chalk.yellowBright('notice text'));
  });

  it('warning method should print text in bright orange color', () => {
    printer.warning('warning text');
    assert.equal(consoleSpy.getLogs()[0], chalk.bgYellow.black('warning text'));
  });

  it('error method should print text in bright red color', () => {
    printer.error('error text');
    assert.equal(consoleSpy.getLogs()[0], chalk.redBright('error text'));
  });

  it('message method should print text in white', () => {
    printer.message('message text');
    assert.equal(consoleSpy.getLogs()[0], chalk.white('message text'));
  });

  it('title method should print text underlined white text', () => {
    printer.title('message text');
    assert.equal(consoleSpy.getLogs()[0], chalk.whiteBright.underline('message text'));
  });
});
