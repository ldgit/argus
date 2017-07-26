var assert = require('assert');
var Watcher = require('../src/file-watcher');
var nullPrinter = require('../src/printer').createNull();

"use strict";

const { fork } = require('child_process');

describe('watcher', function() {
    var watcher;

    this.slow(300);

    beforeEach(function() {
        process.chdir('./test');
        watcher = new Watcher(nullPrinter);
    });

    afterEach(function() {
        watcher.close();
        process.chdir('./../');
    });

    it('should not call given callback if no files changed', function() {
        var callbackWasCalled = false;

        watcher.watchPhpFiles('./mock-project', function() {
            callbackWasCalled = true;
        });

        assert.strictEqual(callbackWasCalled, false);
    });

    it('should throw error if path is string and does not exist', function() {
        assert.throws(function() {
            watcher.watchPhpFiles('./mock-project/nonexistent/path', function() {});
        }, TypeError);
    });

    it('should print out a warning if path is array and any element does not exist', function() {
        var warnings = [];
        nullPrinter.warning = function(text) {
            warnings.push(text);
        };
        watcher.watchPhpFiles(['./mock-project', './mock-project/nonexistent/path'], function() {});
        assert.equal(warnings[0], 'Path "./mock-project/nonexistent/path" does not exist');
    });

    it('should call given callback if a watched file changes and send changed path to callback', function(done) {
        watcher.watchPhpFiles('./mock-project', function(pathToChangedFile) {
            assert.equal('mock-project/src/ExampleFileForFileWatcher.php', pathToChangedFile);
            done();
        });

        // This seems to be the only option that triggers "on file change" callback. Watcher does not seem to be able to
        // detect that the file was changed by this node process (ie. the same node process that test and watcher itself 
        // are running from). The file *needs* to be changed by a different node.js process for this test to work.
        // fork('helpers/touch-php-file.js');
        fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);
    });

    it('should call given callback if a file from a watchlist changes and send changed path to callback', function(done) {
        var watchlist = ['./mock-project/src/ExampleFour.php', './mock-project/src/ExampleFileForFileWatcher.php'];
        watcher.watchPhpFiles(watchlist, function(pathToChangedFile) {
            assert.equal('mock-project/src/ExampleFileForFileWatcher.php', pathToChangedFile);
            done();
        });

        fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);
    });

    it('should watch only php files', function(done) {
        watcher.watchPhpFiles('./mock-project', function(pathToChangedFile) {
            assert.fail('callback was called when it should not have been');
        });

        fork('helpers/touch.js', ['./mock-project/src/Example.js']).on('exit', function() {
          done();
        })
    });

    it('should ignore vendor directory', function(done) {
        watcher.watchPhpFiles('./mock-project', function(pathToChangedFile) {
            assert.fail('callback was called when it should not have been');
        });

        fork('helpers/touch.js', ['./mock-project/vendor/VendorFile.php']).on('exit', function() {
          done();
        })
    })
});

