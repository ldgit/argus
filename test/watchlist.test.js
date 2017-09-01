const assert = require('assert');
const Watchlist = require('../src/watchlist');
const nullPrinter = require('../src/printer').createNull();

describe('watchlist', () => {
  let watchlist;
  let defaultEnvironment;

  beforeEach(() => {
    process.chdir('./test/mock-project');
    watchlist = new Watchlist(nullPrinter);
    defaultEnvironment = {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/unit',
      sourceDir: '',
    };
  });

  afterEach(() => {
    process.chdir('./../..');
  });

  const nonExistentTestDirectories = [
    { dir: 'tset/unit', expectedError: 'Test directory tset/unit was not found' },
    { dir: 'test/units', expectedError: 'Test directory test/units was not found' },
  ];

  const existingTestDirectories = [
    { args: './test/unit', expected: ['test/unit/src/[E]xampleFourTest.php', 'src/[E]xampleFour.php'] },
    { args: './tests/unit', expected: ['tests/unit/src/[E]xampleTwoTest.php', 'src/[E]xampleTwo.php'] },
    { args: 'test/unit', expected: ['test/unit/src/[E]xampleFourTest.php', 'src/[E]xampleFour.php'] },
    { args: './test/unit/', expected: ['test/unit/src/[E]xampleFourTest.php', 'src/[E]xampleFour.php'] },
  ];

  const sourceDirVarieties = [
    'src', './src', 'src/', './src/',
  ];

  nonExistentTestDirectories.forEach((test) => {
    it(`should display an error message if given test directory does not exist (${test.dir})`, () => {
      let textSentToError;
      nullPrinter.error = (text) => {
        textSentToError = text;
      };
      defaultEnvironment.testDir = test.dir;

      watchlist.compileFor([defaultEnvironment]);

      assert.equal(textSentToError, test.expectedError);
    });
  });

  existingTestDirectories.forEach((test) => {
    it(`should compile watchlist of globified filepaths from given "${test.args}" test directory`, () => {
      defaultEnvironment.testDir = test.args;
      const locationsToWatch = watchlist.compileFor([defaultEnvironment]);
      assert.deepEqual(locationsToWatch, test.expected);
    });
  });

  it('should use test name suffix to detect which tests and files to watch', () => {
    defaultEnvironment.testNameSuffix = '.foobar';
    const actualWatchlist = watchlist.compileFor([defaultEnvironment]);
    assert.deepEqual(actualWatchlist, ['test/unit/src/[E]xampleFour.foobar.php', 'src/[E]xampleFour.php']);
  });

  it('should use file extension to detect which tests and files to watch', () => {
    defaultEnvironment.extension = 'js';
    const actualWatchlist = watchlist.compileFor([defaultEnvironment]);
    assert.deepEqual(actualWatchlist, ['test/unit/src/[E]xampleFourTest.js', 'src/[E]xampleFour.js']);
  });

  sourceDirVarieties.forEach((sourceDir) => {
    it('should use environment source directory to detect which source files to watch', () => {
      const env = getEnvironmentSoThatFixtureFilesDoNotConflictWithOtherTests();
      env.sourceDir = sourceDir;

      const actualWatchlist = watchlist.compileFor([env]);

      assert.deepEqual(actualWatchlist, ['test/unit/[E]xampleFour.test.js', 'src/[E]xampleFour.js']);
    });
  });

  it('should support multiple environments', () => {
    const actualWatchlist = watchlist.compileFor([
      defaultEnvironment,
      jsEnvironmentWithDifferentSourceDir(),
    ]);
    assert.deepEqual(actualWatchlist.sort(), [
      'test/unit/[E]xampleFour.test.js',
      'src/[E]xampleFour.js',
      'test/unit/src/[E]xampleFourTest.php',
      'src/[E]xampleFour.php',
    ].sort());
  });

  function getEnvironmentSoThatFixtureFilesDoNotConflictWithOtherTests() {
    const newEnv = JSON.parse(JSON.stringify(defaultEnvironment));
    newEnv.extension = 'js';
    newEnv.testNameSuffix = '.test';

    return newEnv;
  }

  function jsEnvironmentWithDifferentSourceDir() {
    const env = getEnvironmentSoThatFixtureFilesDoNotConflictWithOtherTests();
    env.sourceDir = 'src';

    return env;
  }
});
