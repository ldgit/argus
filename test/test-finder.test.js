const assert = require('assert');
const TestFinder = require('../src/test-finder');

describe('test-finder', () => {
  const rootDir = process.cwd();
  let environments;
  let testFinder;
  let phpEnvironment;
  let jsEnvironment;

  context('findTestsFor method, when searching for test file', () => {
    beforeEach(() => {
      phpEnvironment = createEnvironment('php', 'tests/unit', 'Test');
      jsEnvironment = createEnvironment('js', 'test/unit', '.test');
      environments = [jsEnvironment, phpEnvironment];
      process.chdir('./test/fixtures/test-finder.test/mock-project');
      testFinder = new TestFinder(environments);
    });

    afterEach(() => {
      process.chdir(rootDir);
    });

    it('should look through given environments and find appropriate test file', () => {
      assertTestFound(testFinder.findTestsFor('src/ExampleTwo.php'), 'tests/unit/src/ExampleTwoTest.php', phpEnvironment);
      assertTestFound(testFinder.findTestsFor('src/ExampleFour.js'), 'test/unit/src/ExampleFour.test.js', jsEnvironment);
      phpEnvironment.testDir = 'tests';
      assertTestFound(testFinder.findTestsFor('src/ExampleOne.php'), 'tests/src/ExampleOneTest.php', phpEnvironment);
    });

    it('should remove sourceDir from test file path', () => {
      phpEnvironment.sourceDir = 'src';
      phpEnvironment.testDir = 'tests';
      assertTestFound(testFinder.findTestsFor('src/ExampleTwo.php'), 'tests/ExampleTwoTest.php', phpEnvironment);
      assertTestFound(testFinder.findTestsFor('src/ExampleWithsrcDirInName.php'), 'tests/ExampleWithsrcDirInNameTest.php', phpEnvironment);
    });

    context('given a test file', () => {
      it('should return that same file', () => {
        assertTestFound(testFinder.findTestsFor('tests/unit/src/ExampleTwoTest.php'), 'tests/unit/src/ExampleTwoTest.php', phpEnvironment);
        assertTestFound(testFinder.findTestsFor('test/unit/src/ExampleFour.test.js'), 'test/unit/src/ExampleFour.test.js', jsEnvironment);
      });
    });

    it('should find all possible test files if given file matches multiple environments (order matters)', () => {
      const phpIntegrationEnvironment = createEnvironment('php', 'tests/integration');
      environments.push(phpIntegrationEnvironment);
      assert.deepEqual(testFinder.findTestsFor('src/ExampleTwo.php'), [
        { path: 'tests/unit/src/ExampleTwoTest.php', environment: phpEnvironment },
        { path: 'tests/integration/src/ExampleTwoTest.php', environment: phpIntegrationEnvironment },
      ]);
    });

    it('should return empty array if test file was not found', () => {
      assert.deepEqual(testFinder.findTestsFor('nonexistent/file.php'), []);
    });
  });

  function assertTestFound(actualTests, expectedTestPath, expectedEnvironment = phpEnvironment) {
    assert.deepEqual(actualTests, [{ path: expectedTestPath, environment: expectedEnvironment }]);
  }

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
