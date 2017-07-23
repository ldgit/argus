var assert = require('assert');
var TestFinder = require('../src/test-finder');

describe('test-finder', function() {
    var testFinder;

    context('findTestFor method, when searching for test file', function() {
        beforeEach(function() {
            process.chdir('./test/mock-project');
            testFinder = new TestFinder();
        });

        afterEach(function() {
            process.chdir('./../../');
        });

        it('should look for test file in tests directory', function() {
            assert.equal(testFinder.findTestFor('src/ExampleOne.php'), 'tests/src/ExampleOneTest.php');
        });

        it('should look for test file in tests/unit directory', function() {
            assert.equal(testFinder.findTestFor('src/ExampleTwo.php'), 'tests/unit/src/ExampleTwoTest.php');
        });

        it('should look for test file in test directory', function() {
            assert.equal(testFinder.findTestFor('src/ExampleThree.php'), 'test/src/ExampleThreeTest.php');
        });

        it('should look for test file in test/unit directory', function() {
            assert.equal(testFinder.findTestFor('src/ExampleFour.php'), 'test/unit/src/ExampleFourTest.php');
        });

        context('and if test was not found', function() {
            it('should return empty path', function() {
                assert.strictEqual(testFinder.findTestFor('nonexistent/file.php'), '');
            });
        });
    });

    context('getTestDir method', function() {
        beforeEach(function() {
            testFinder = new TestFinder();
        });

        afterEach(function() {
            process.chdir('./../../../');
        });

        tests = [
            {projectDir: 'project-one', expectedTestDir: 'tests/'},
            {projectDir: 'project-two', expectedTestDir: 'tests/unit/'},
            {projectDir: 'project-three', expectedTestDir: 'test/unit/'},
            {projectDir: 'project-four', expectedTestDir: 'test/'},
        ];

        tests.forEach(function(test) {
            it('should return "' + test.expectedTestDir + '" test directory for ' + test.projectDir, function() {
                process.chdir('./test/mock-projects-with-different-test-dirs/' + test.projectDir);
                assert.equal(testFinder.getTestDir(), test.expectedTestDir);
            });
        });

        it('should return throw error if test directory not found', function() {
            process.chdir('./test/mock-projects-with-different-test-dirs/lame-project');
            assert.throws(function() {
                testFinder.getTestDir()
            }, Error);
        });
    });
});
