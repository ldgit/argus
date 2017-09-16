const assert = require('assert');
const chalk = require('chalk');
const Printer = require('../src/printer').Printer;

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
    printer = new Printer(console);
  });

  it('info method should print info text in bright cyan color', () => {
    printer.info('info text');
    assert.equal(console.getLogs()[0], chalk.cyanBright('info text'));
  });

  it('notice method should print info text in bright cyan color', () => {
    printer.notice('info text');
    assert.equal(console.getLogs()[0], chalk.yellowBright('info text'));
  });

  it('warning method should print text in bright orange color', () => {
    printer.warning('info text');
    assert.equal(console.getLogs()[0], chalk.bgYellow.black('info text'));
  });

  it('error method should print text in bright red color', () => {
    printer.error('info text');
    assert.equal(console.getLogs()[0], chalk.redBright('info text'));
  });
});
