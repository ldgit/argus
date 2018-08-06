const assert = require('assert');
const chalk = require('chalk');
const { createConsolePrinter, format } = require('../src/printer');

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
    assert.equal(consoleSpy.getLogs()[0], 'message text');
  });

  it('title method should print text underlined white text', () => {
    printer.title('message text');
    assert.equal(consoleSpy.getLogs()[0], chalk.whiteBright.underline('message text'));
  });
});

describe('formatter', () => {
  it('should format text as title', () => {
    assert.equal(format.asTitle('message text'), chalk.whiteBright.underline('message text'));
  });

  it('should format text in red', () => {
    assert.equal(format.red('message text'), chalk.redBright('message text'));
  });

  it('should format text as warning', () => {
    assert.equal(format.asWarning('message text'), chalk.bgYellow.black('message text'));
  });

  it('should format text in blue', () => {
    assert.equal(format.blue('message text'), chalk.cyanBright('message text'));
  });

  it('should format text in yellow', () => {
    assert.equal(format.yellow('message text'), chalk.yellowBright('message text'));
  });
});
