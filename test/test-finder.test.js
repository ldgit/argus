const { expect } = require('chai');
const path = require('path');
const configureFindTestsFor = require('../src/test-finder');

describe('test-finder', () => {
  const rootDir = process.cwd();
  let environments;
  let findTestsFor;
  let phpEnvironment;
  let jsEnvironment;

  context('findTestsFor method, when searching for test file', () => {
    beforeEach(() => {
      phpEnvironment = createEnvironment('php', 'tests/unit', 'Test');
      jsEnvironment = createEnvironment('js', 'test/unit', '.test');
      environments = [jsEnvironment, phpEnvironment];
      process.chdir('./test/fixtures/test-finder.test/mock-project');
      findTestsFor = configureFindTestsFor(environments);
    });

    afterEach(() => {
      process.chdir(rootDir);
    });

    it('should look through given environments and find appropriate test file', () => {
      assertTestFound(
        findTestsFor('src/ExampleTwo.php'),
        'tests/unit/src/ExampleTwoTest.php',
        phpEnvironment,
      );
      assertTestFound(
        findTestsFor('src/ExampleFour.js'),
        'test/unit/src/ExampleFour.test.js',
        jsEnvironment,
      );

      phpEnvironment.testDir = 'tests';
      assertTestFound(
        findTestsFor('src/ExampleOne.php'),
        'tests/src/ExampleOneTest.php',
        phpEnvironment,
      );
    });

    it('should remove sourceDir from test file path', () => {
      phpEnvironment.sourceDir = 'src';
      phpEnvironment.testDir = 'tests';
      assertTestFound(
        findTestsFor('src/ExampleTwo.php'),
        'tests/ExampleTwoTest.php',
        phpEnvironment,
      );
      assertTestFound(
        findTestsFor('src/ExampleWithsrcDirInName.php'),
        'tests/ExampleWithsrcDirInNameTest.php',
        phpEnvironment,
      );
    });

    context('given a test file', () => {
      it('should return that same file', () => {
        assertTestFound(
          findTestsFor('tests/unit/src/ExampleTwoTest.php'),
          'tests/unit/src/ExampleTwoTest.php',
          phpEnvironment,
        );
        assertTestFound(
          findTestsFor('test/unit/src/ExampleFour.test.js'),
          'test/unit/src/ExampleFour.test.js',
          jsEnvironment,
        );
      });
    });

    it('should find all possible test files if given file matches multiple environments (order matters)', () => {
      const phpIntegrationEnvironment = createEnvironment('php', 'tests/integration');
      environments.push(phpIntegrationEnvironment);
      expect(findTestsFor('src/ExampleTwo.php')).to.eql([
        { path: path.join('tests/unit/src/ExampleTwoTest.php'), environment: phpEnvironment },
        {
          path: path.join('tests/integration/src/ExampleTwoTest.php'),
          environment: phpIntegrationEnvironment,
        },
      ]);
    });

    it('should return empty array if test file was not found', () => {
      expect(findTestsFor('nonexistent/file.php')).to.eql([]);
    });

    it('should normalize dir separators when looking for test files', () => {
      phpEnvironment.testDir = 'tests/unit';
      expect(findTestsFor('tests\\unit\\src\\ExampleTwoTest.php')).to.eql([
        { path: path.join('tests/unit/src/ExampleTwoTest.php'), environment: phpEnvironment },
      ]);

      phpEnvironment.testDir = 'tests\\unit';
      expect(findTestsFor('tests/unit/src/ExampleTwoTest.php')).to.eql([
        { path: path.join('tests/unit/src/ExampleTwoTest.php'), environment: phpEnvironment },
      ]);
    });

    it('should work when source and test are in the same dir', () => {
      const environment = createEnvironment('js', 'src', '.test', 'src');
      findTestsFor = configureFindTestsFor([environment]);

      assertTestFound(findTestsFor('src/ExampleFour.js'), 'src/ExampleFour.test.js', environment);
    });
  });

  function assertTestFound(actualTests, expectedTestPath, expectedEnvironment = phpEnvironment) {
    expect(actualTests).to.eql([
      { path: path.join(expectedTestPath), environment: expectedEnvironment },
    ]);
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
