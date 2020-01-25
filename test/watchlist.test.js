const assert = require('assert');
const path = require('path');
const { configureCompileWatchlist } = require('../src/watchlist');
const { createPrinterSpy } = require('../src/printer');

describe('watchlist', () => {
  const rootDir = process.cwd();
  let compileWatchlistFor;
  let defaultEnvironment;
  let printerSpy;

  beforeEach(() => {
    process.chdir(path.join('./test/fixtures/watchlist.test/mock-project'));
    printerSpy = createPrinterSpy();
    compileWatchlistFor = configureCompileWatchlist.bind(null, printerSpy);
    defaultEnvironment = {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/unit',
      sourceDir: '',
    };
  });

  afterEach(() => {
    process.chdir(rootDir);
  });

  const nonExistentTestDirectories = [
    { dir: 'tset/unit', expectedError: `Test directory ${path.join('tset/unit')} was not found` },
    { dir: 'test/units', expectedError: `Test directory ${path.join('test/units')} was not found` },
  ];

  const existingTestDirectories = [
    { args: './test/unit', expected: ['test/unit/src/ExampleFourTest.php', 'src/ExampleFour.php'] },
    { args: './tests/unit', expected: ['tests/unit/src/ExampleTwoTest.php', 'src/ExampleTwo.php'] },
    { args: 'test/unit', expected: ['test/unit/src/ExampleFourTest.php', 'src/ExampleFour.php'] },
    { args: './test/unit/', expected: ['test/unit/src/ExampleFourTest.php', 'src/ExampleFour.php'] },
  ];

  const sourceDirVarieties = [
    'src', './src', 'src/', './src/',
  ];

  context('when given nonexistent directories', () => {
    nonExistentTestDirectories.forEach((test) => {
      it(`should display an error message (${test.dir})`, () => {
        defaultEnvironment.testDir = test.dir;
        compileWatchlistFor([defaultEnvironment]);
        assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], { text: test.expectedError, type: 'error' });
      });
    });
  });

  context('when source file not found for test', () => {
    beforeEach(() => {
      defaultEnvironment.extension = 'js';
      defaultEnvironment.testNameSuffix = '.test';
      defaultEnvironment.testDir = 'test-nosource';
    });

    it('should print out a notice for any source file that does not exist', () => {
      compileWatchlistFor([defaultEnvironment]);
      assert.deepStrictEqual(
        printerSpy.getPrintedMessages()[0],
        { text: 'Source file not found for test: "test-nosource/NoSourceForThis.test.js"', type: 'notice' },
      );
    });

    it('should filter out paths that don\'t exist (so that ready event will fire correctly)', () => {
      const actualWatchlist = compileWatchlistFor([defaultEnvironment]);
      assert.deepEqual(actualWatchlist, [path.join('test-nosource/NoSourceForThis.test.js')]);
    });
  });

  existingTestDirectories.forEach((test) => {
    it(`should compile watchlist of filepaths from given "${test.args}" test directory`, () => {
      defaultEnvironment.testDir = test.args;
      const locationsToWatch = compileWatchlistFor([defaultEnvironment]);
      assertListsAreEqual(locationsToWatch, test.expected);
    });
  });

  it('should use test name suffix to detect which tests and files to watch', () => {
    defaultEnvironment.testNameSuffix = '.foobar';
    const actualWatchlist = compileWatchlistFor([defaultEnvironment]);
    assertListsAreEqual(actualWatchlist, ['test/unit/src/ExampleFour.foobar.php', 'src/ExampleFour.php']);
  });

  it('should use file extension to detect which tests and files to watch', () => {
    defaultEnvironment.extension = 'js';
    const actualWatchlist = compileWatchlistFor([defaultEnvironment]);
    assertListsAreEqual(actualWatchlist, ['test/unit/src/ExampleFourTest.js', 'src/ExampleFour.js']);
  });

  sourceDirVarieties.forEach((sourceDir) => {
    it('should use environment source directory to detect which source files to watch', () => {
      const env = getDefaultJavascriptEnvironment();
      env.sourceDir = sourceDir;

      const actualWatchlist = compileWatchlistFor([env]);

      assertListsAreEqual(actualWatchlist, ['test/unit/ExampleFour.test.js', 'src/ExampleFour.js']);
    });
  });

  it('should support multiple environments', () => {
    const actualWatchlist = compileWatchlistFor([
      defaultEnvironment,
      jsEnvironmentWithDifferentSourceDir(),
    ]);
    assertListsAreEqual(actualWatchlist, [
      'test/unit/ExampleFour.test.js',
      'src/ExampleFour.js',
      'test/unit/src/ExampleFourTest.php',
      'src/ExampleFour.php',
    ]);
  });

  it('should remove duplicates', () => {
    const integrationEnvironment = {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/integration',
      sourceDir: '',
    };

    const actualWatchlist = compileWatchlistFor([defaultEnvironment, integrationEnvironment]);

    assertListsAreEqual(actualWatchlist, [
      'src/ExampleFour.php',
      'test/integration/src/ExampleFourTest.php',
      'test/unit/src/ExampleFourTest.php',
    ]);
  });

  function assertListsAreEqual(actual, expected) {
    assert.deepEqual(actual.sort(), expected.map(filePath => path.join(filePath)).sort());
  }

  function jsEnvironmentWithDifferentSourceDir() {
    const env = getDefaultJavascriptEnvironment();
    env.sourceDir = 'src';

    return env;
  }

  function getDefaultJavascriptEnvironment() {
    const newEnv = JSON.parse(JSON.stringify(defaultEnvironment));
    newEnv.extension = 'js';
    newEnv.testNameSuffix = '.test';

    return newEnv;
  }
});
