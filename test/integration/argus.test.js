var assert = require('assert');
var Argus = require('../../src/argus').Argus;
const fork = require('child_process').fork;

describe('argus', function() {
    this.slow(500);

    var argus;
    var lastRunCommand = '';

    var CommandRunnerMock = function () {
        this.run = function (command) {
            lastRunCommand = command;
        };
    };

    beforeEach(function() {
        process.chdir('./test/integration/mock-project/');
        argus = new Argus(new CommandRunnerMock());
    });

    afterEach(function() {
        process.chdir('./../../../');
    });

    it('should watch project source files and run console command if they change', function(done) {
        argus.run('.');
        fork('./../../helpers/touch.js', ['./src/PhpClass.php']);

        setTimeout(function() {
            assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
            assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
            done();
        }, 200);
    });

    it('should watch project test files and run console command if they change', function(done) {
        argus.run();
        fork('./../../helpers/touch.js', ['./tests/src/PhpClassTest.php']);

        setTimeout(function() {
            assert.equal(lastRunCommand.command, 'vendor/bin/phpunit');
            assert.deepEqual(lastRunCommand.args, ['tests/src/PhpClassTest.php']);
            done();
        }, 200);
    });
});
