const { expect } = require('chai');
const chalk = require('chalk');
const { createConsolePrinter, format } = require('../src/printer');

describe('printer', () => {
  let printer;
  let consoleSpy;

  function ConsoleSpy() {
    const logs = [];
    this.log = text => {
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
    expect(consoleSpy.getLogs()[0]).to.equal(chalk.cyanBright('info text'));
  });

  it('notice method should print text in bright yellow color', () => {
    printer.notice('notice text');
    expect(consoleSpy.getLogs()[0]).to.equal(chalk.yellowBright('notice text'));
  });

  it('warning method should print text in bright orange color', () => {
    printer.warning('warning text');
    expect(consoleSpy.getLogs()[0]).to.equal(chalk.bgYellow.black('warning text'));
  });

  it('error method should print text in bright red color', () => {
    printer.error('error text');
    expect(consoleSpy.getLogs()[0]).to.equal(chalk.redBright('error text'));
  });

  it('message method should print text in white', () => {
    printer.message('message text');
    expect(consoleSpy.getLogs()[0]).to.equal('message text');
  });

  it('title method should print text underlined white text', () => {
    printer.title('message text');
    expect(consoleSpy.getLogs()[0]).to.equal(chalk.whiteBright.underline('message text'));
  });
});

describe('formatter', () => {
  it('should format text as title', () => {
    expect(format.asTitle('message text')).to.equal(chalk.whiteBright.underline('message text'));
  });

  it('should format text in red', () => {
    expect(format.red('message text')).to.equal(chalk.redBright('message text'));
  });

  it('should format text as warning', () => {
    expect(format.asWarning('message text')).to.equal(chalk.bgYellow.black('message text'));
  });

  it('should format text in blue', () => {
    expect(format.blue('message text')).to.equal(chalk.cyanBright('message text'));
  });

  it('should format text in yellow', () => {
    expect(format.yellow('message text')).to.equal(chalk.yellowBright('message text'));
  });
});
