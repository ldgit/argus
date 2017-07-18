var assert = require('assert');
var TestFinder = require('../src/test-finder');

"use strict";

describe('test-finder', function() {
    var testFinder;
    var emptyPathTest = function() {
        assert.strictEqual(testFinder.findTestFor('nonexistent/file.php'), '');
    };

    beforeEach(function() {
        process.chdir('./test/fixtures');
    });

    afterEach(function() {
        process.chdir('./../../');
    });

    context('with no test path given', function() {
        beforeEach(function() {
            testFinder = new TestFinder();
        });

        it('should return empty path if test not found', emptyPathTest);

        it('should look for test file in tests directory', function() {
            assert.equal(testFinder.findTestFor('src/Example.php'), 'tests/src/ExampleTest.php');
        });
    });

    context('with tests path given', function() {
        beforeEach(function() {
            testFinder = new TestFinder('tests/unit/');
        });

        it('should return empty path if test not found', emptyPathTest);

        it('should look for test file in given test path directory', function() {
            assert.equal(testFinder.findTestFor('src/Example.php'), 'tests/unit/src/ExampleTest.php');
        });
    });
});