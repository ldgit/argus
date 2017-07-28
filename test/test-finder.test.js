const assert = require('assert');
const TestFinder = require('../src/test-finder');

describe('test-finder', () => {
  let testFinder;

  context('findTestFor method, when searching for test file', () => {
    beforeEach(() => {
      process.chdir('./test/mock-project');
      testFinder = new TestFinder();
    });

    afterEach(() => {
      process.chdir('./../../');
    });

    const testsGroup = [
      { startingFile: 'src/ExampleOne.php', expectedTestFile: 'tests/src/ExampleOneTest.php' },
      { startingFile: 'src/ExampleTwo.php', expectedTestFile: 'tests/unit/src/ExampleTwoTest.php' },
      { startingFile: 'src/ExampleThree.php', expectedTestFile: 'test/src/ExampleThreeTest.php' },
      { startingFile: 'src/ExampleFour.php', expectedTestFile: 'test/unit/src/ExampleFourTest.php' },
      { startingFile: 'tests/src/ExampleOneTest.php', expectedTestFile: 'tests/src/ExampleOneTest.php' },
      { startingFile: 'tests/unit/src/ExampleTwoTest.php', expectedTestFile: 'tests/unit/src/ExampleTwoTest.php' },
      { startingFile: 'test/src/ExampleThreeTest.php', expectedTestFile: 'test/src/ExampleThreeTest.php' },
      { startingFile: 'test/unit/src/ExampleFourTest.php', expectedTestFile: 'test/unit/src/ExampleFourTest.php' },
    ];

    testsGroup.forEach((test) => {
      it(`should look for test for file "${test.startingFile}" in possible test directories`, () => {
        assert.equal(testFinder.findTestFor(test.startingFile), test.expectedTestFile);
      });
    });

    context('and if test file was not found', () => {
      it('should return empty path', () => {
        assert.strictEqual(testFinder.findTestFor('nonexistent/file.php'), '');
      });
    });
  });

  context('getTestDir method', () => {
    beforeEach(() => {
      testFinder = new TestFinder();
    });

    afterEach(() => {
      process.chdir('./../../../');
    });

    const tests = [
      { projectDir: 'project-one', expectedTestDir: 'tests/' },
      { projectDir: 'project-two', expectedTestDir: 'tests/unit/' },
      { projectDir: 'project-three', expectedTestDir: 'test/unit/' },
      { projectDir: 'project-four', expectedTestDir: 'test/' },
    ];

    tests.forEach((test) => {
      it(`should return "${test.expectedTestDir}" test directory for "${test.projectDir}"`, () => {
        process.chdir(`./test/mock-projects-with-different-test-dirs/${test.projectDir}`);
        assert.equal(testFinder.getTestDir(), test.expectedTestDir);
      });
    });

    it('should return throw error if test directory not found', () => {
      process.chdir('./test/mock-projects-with-different-test-dirs/lame-project');
      assert.throws(() => {
        testFinder.getTestDir();
      }, Error);
    });
  });
});
