const assert = require('assert');
const path = require('path');
const TestFinder = require('../src/test-finder');

describe('test-finder', () => {
  let environments;
  let testFinder;
  let phpEnvironment;
  let jsEnvironment;

  context('findTestFor method, when searching for test file', () => {
    beforeEach(() => {
      phpEnvironment = createEnvironment('php', 'tests/unit', 'Test');
      jsEnvironment = createEnvironment('js', 'test/unit', '.test');
      environments = [jsEnvironment, phpEnvironment];
      process.chdir('./test/fixtures/test-finder.test/mock-project');
      testFinder = new TestFinder(environments);
    });

    afterEach(() => {
      process.chdir(path.join('.', '..', '..', '..', '..'));
    });

    it('should look through given environments and find appropriate test file', () => {
      assert.deepEqual(testFinder.findTestFor('src/ExampleTwo.php'), ['tests/unit/src/ExampleTwoTest.php']);
      assert.deepEqual(testFinder.findTestFor('src/ExampleFour.js'), ['test/unit/src/ExampleFour.test.js']);
      phpEnvironment.testDir = 'tests';
      assert.deepEqual(testFinder.findTestFor('src/ExampleOne.php'), ['tests/src/ExampleOneTest.php']);
    });

    context('given a test file', () => {
      it('should return that same file', () => {
        assert.deepEqual(testFinder.findTestFor('tests/unit/src/ExampleTwoTest.php'), ['tests/unit/src/ExampleTwoTest.php']);
        assert.deepEqual(testFinder.findTestFor('test/unit/src/ExampleFour.test.js'), ['test/unit/src/ExampleFour.test.js']);
      });
    });

    it('should find all possible test files if given file matches multiple environments (order matters)', () => {
      environments.push(createEnvironment('php', 'tests/integration'));
      assert.deepEqual(testFinder.findTestFor('src/ExampleTwo.php'), [
        'tests/unit/src/ExampleTwoTest.php',
        'tests/integration/src/ExampleTwoTest.php',
      ]);
    });

    it('should return empty array if test file was not found', () => {
      assert.deepEqual(testFinder.findTestFor('nonexistent/file.php'), []);
    });
  });

  function createEnvironment(type, testDirectory, testSuffix = 'Test', sourceDirectory = '') {
    return {
      extension: type,
      testNameSuffix: testSuffix,
      testDir: testDirectory,
      sourceDir: sourceDirectory,
      arguments: ['unimportant for these tests'],
      testRunnerCommand: 'unimportant for these tests',
    };
  }
});
