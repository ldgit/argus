var assert = require('assert');
var CommandBuilder = require('../src/command-builder');

describe('command-builder', function() {
    var commandBuilder;

    beforeEach(function() {
        commandBuilder = new CommandBuilder();
    });

    context('given a path to php test file', function() {
        it('should return a command to run it in phpunit', function() {
            assert.deepEqual(
                commandBuilder.buildFor('tests/src/ExampleOneTest.php'), 
                {
                    command: 'vendor/bin/phpunit', 
                    args: ['tests/src/ExampleOneTest.php']
                }
            );
            assert.deepEqual(
                commandBuilder.buildFor('tests/unit/src/ExampleOneTest.php'), 
                {
                    command: 'vendor/bin/phpunit', 
                    args: ['tests/unit/src/ExampleOneTest.php']
                }
            );
        });
    });
});
