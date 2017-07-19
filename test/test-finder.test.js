var assert = require('assert');
var TestFinder = require('../src/test-finder');

describe('test-finder', function() {
    var testFinder;

    beforeEach(function() {
        process.chdir('./test/fixtures');
        testFinder = new TestFinder();
    });

    afterEach(function() {
        process.chdir('./../../');
    });

    context('when searching for test file', function() {
        it('should look for test file in tests directory first', function() {
            assert.equal(testFinder.findTestFor('src/ExampleOne.php'), 'tests/src/ExampleOneTest.php');
        });

        it('should look for test file in tests/unit directory second', function() {
            assert.equal(testFinder.findTestFor('src/ExampleTwo.php'), 'tests/unit/src/ExampleTwoTest.php');
        });

        it('should look for test file in test directory third', function() {
            assert.equal(testFinder.findTestFor('src/ExampleThree.php'), 'test/src/ExampleThreeTest.php');
        });

        it('should look for test file in test/unit directory fourth', function() {
            assert.equal(testFinder.findTestFor('src/ExampleFour.php'), 'test/unit/src/ExampleFourTest.php');
        });

        context('and if test was not found', function() {
            it('should return empty path', function() {
                assert.strictEqual(testFinder.findTestFor('nonexistent/file.php'), '');
            });
        });
    });
});