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

        testsGroup = [
            {startingFile: 'src/ExampleOne.php', expectedTestFile: 'tests/src/ExampleOneTest.php'},
            {startingFile: 'src/ExampleTwo.php', expectedTestFile: 'tests/unit/src/ExampleTwoTest.php'},
            {startingFile: 'src/ExampleThree.php', expectedTestFile: 'test/src/ExampleThreeTest.php'},
            {startingFile: 'src/ExampleFour.php', expectedTestFile: 'test/unit/src/ExampleFourTest.php'},
            {startingFile: 'tests/src/ExampleOneTest.php', expectedTestFile: 'tests/src/ExampleOneTest.php'},
            {startingFile: 'tests/unit/src/ExampleTwoTest.php', expectedTestFile: 'tests/unit/src/ExampleTwoTest.php'},
            {startingFile: 'test/src/ExampleThreeTest.php', expectedTestFile: 'test/src/ExampleThreeTest.php'},
            {startingFile: 'test/unit/src/ExampleFourTest.php', expectedTestFile: 'test/unit/src/ExampleFourTest.php'},
        ];

        testsGroup.forEach(function(test) {
            it('should look for test for file "' + test.startingFile + '" in possible test directories', function() {
                assert.equal(testFinder.findTestFor(test.startingFile), test.expectedTestFile);
            });
        });

        context('and if test file was not found', function() {
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
