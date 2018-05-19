const assert = require('assert');
const chalk = require('chalk');
const { createConsolePrinter } = require('../src/printer');

describe('printer', () => {
  let printer;
  let console;

  function ConsoleSpy() {
    const logs = [];
    this.log = (text) => {
      logs.push(text);
    };

    this.getLogs = () => logs;
  }

  beforeEach(() => {
    console = new ConsoleSpy();
    printer = createConsolePrinter(console);
  });

  it('info method should print text in bright cyan color', () => {
    printer.info('info text');
    assert.equal(console.getLogs()[0], chalk.cyanBright('info text'));
  });

  it('notice method should print text in bright yellow color', () => {
    printer.notice('notice text');
    assert.equal(console.getLogs()[0], chalk.yellowBright('notice text'));
  });

  it('warning method should print text in bright orange color', () => {
    printer.warning('warning text');
    assert.equal(console.getLogs()[0], chalk.bgYellow.black('warning text'));
  });

  it('error method should print text in bright red color', () => {
    printer.error('info text');
    assert.equal(console.getLogs()[0], chalk.redBright('info text'));
  });
});
