const assert = require('assert');
const chalk = require('chalk');
const Printer = require('../src/printer').Printer;

describe('printer', function() {
    var printer;
    var console;
    var ConsoleSpy = function(){
        var logs = [];
        this.log = function(text) {
            logs.push(text);
        };

        this.getLogs = function() {
            return logs;
        };
    };

    beforeEach(function() {
        console = new ConsoleSpy();
        printer = new Printer(console);
    });

    context('info method', function(){
        it('should print info text in bright cyan color', function() {
            printer.info('info tekst');
            assert.equal(console.getLogs()[0], chalk.cyanBright('info tekst'));
        });
    });
        
    context('warning method', function(){
        it('should print text in bright yellow color', function() {
            printer.warning('info tekst');
            assert.equal(console.getLogs()[0], chalk.yellowBright('info tekst'));
        });
    });
        
    context('error method', function(){
        it('should print text in bright red color', function() {
            printer.error('info tekst');
            assert.equal(console.getLogs()[0], chalk.redBright('info tekst'));
        });
    });
});
