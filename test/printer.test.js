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

  context('info method', () => {
    it('should print info text in bright cyan color', () => {
      printer.info('info tekst');
      assert.equal(console.getLogs()[0], chalk.cyanBright('info tekst'));
    });
  });

  context('warning method', () => {
    it('should print text in bright yellow color', () => {
      printer.warning('info tekst');
      assert.equal(console.getLogs()[0], chalk.yellowBright('info tekst'));
    });
  });

  context('error method', () => {
    it('should print text in bright red color', () => {
      printer.error('info tekst');
      assert.equal(console.getLogs()[0], chalk.redBright('info tekst'));
    });
  });
});
