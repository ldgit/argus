var assert = require('chai').assert;
var Watcher = require('../src/watcher');

"use strict";

const { fork } = require('child_process');

describe('watcher', function() {
    var watcher;

    beforeEach(function() {
        process.chdir('./test');
        watcher = new Watcher();
    });

    afterEach(function() {
        process.chdir('./../');
    });

    it('should not call given callback if no files changed', function() {
        var callbackWasCalled = false;

        watcher.watchPhpFiles('./fixtures', function() {
            callbackWasCalled = true;
        });

        assert.isFalse(callbackWasCalled);
    });

    it('should throw error if path does not exist', function() {
        assert.throws(function() {
            watcher.watchPhpFiles('./fixtures/nonexistent/path', function() {});
        }, TypeError);
    });

    it('should call given callback if a watched file changes and send changed path to callback', function(done) {
        watcher.watchPhpFiles('./fixtures', function(pathToChangedFile) {
            assert.equal('fixtures/src/Example.php', pathToChangedFile);
            done();
        });

        // This seems to be the only option that triggers "on file change" callback. Watcher does not seem to be able to
        // detect that the file was changed by this node process (ie. the same node process that watcher itself is 
        // running from). The file *needs* to be changed by a different node.js process for this test to work.
        fork('touch.js');
    })
});

