const assert = require('assert');
const Watchlist = require('../src/watchlist');
const nullPrinter = require('../src/printer').createNull();

describe('watchlist', () => {
  const rootDir = process.cwd();
  let watchlist;
  let defaultEnvironment;

  beforeEach(() => {
    process.chdir('./test/fixtures/watchlist.test/mock-project');
    watchlist = new Watchlist(nullPrinter);
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

  context('when given nonexistent directories', () => {
    nonExistentTestDirectories.forEach((test) => {
      it(`should display an error message (${test.dir})`, () => {
        const errors = [];
        nullPrinter.error = text => errors.push(text);
        defaultEnvironment.testDir = test.dir;

        watchlist.compileFor([defaultEnvironment]);

        assert.equal(errors[0], test.expectedError);
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
      const notices = [];
      nullPrinter.notice = text => notices.push(text);

      watchlist.compileFor([defaultEnvironment]);

      assert.equal(
        notices[0],
        'Source file not found for test: "test-nosource/NoSourceForThis.test.js"'
      );
    });

    it('should filter out paths that don\'t exist (so that ready event will fire correctly)', () => {
      const actualWatchlist = watchlist.compileFor([defaultEnvironment]);
      assert.deepEqual(actualWatchlist, ['test-nosource/[N]oSourceForThis.test.js']);
    });
  });

  existingTestDirectories.forEach((test) => {
    it(`should compile watchlist of globified filepaths from given "${test.args}" test directory`, () => {
      defaultEnvironment.testDir = test.args;
      const locationsToWatch = watchlist.compileFor([defaultEnvironment]);
      assertListsAreEqual(locationsToWatch, test.expected);
    });
  });

  it('should use test name suffix to detect which tests and files to watch', () => {
    defaultEnvironment.testNameSuffix = '.foobar';
    const actualWatchlist = watchlist.compileFor([defaultEnvironment]);
    assertListsAreEqual(actualWatchlist, ['test/unit/src/[E]xampleFour.foobar.php', 'src/[E]xampleFour.php']);
  });

  it('should use file extension to detect which tests and files to watch', () => {
    defaultEnvironment.extension = 'js';
    const actualWatchlist = watchlist.compileFor([defaultEnvironment]);
    assertListsAreEqual(actualWatchlist, ['test/unit/src/[E]xampleFourTest.js', 'src/[E]xampleFour.js']);
  });

  sourceDirVarieties.forEach((sourceDir) => {
    it('should use environment source directory to detect which source files to watch', () => {
      const env = getDefaultJavascriptEnvironment();
      env.sourceDir = sourceDir;

      const actualWatchlist = watchlist.compileFor([env]);

      assertListsAreEqual(actualWatchlist, ['test/unit/[E]xampleFour.test.js', 'src/[E]xampleFour.js']);
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

  it('should remove duplicates', () => {
    const integrationEnvironment = {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'test/integration',
      sourceDir: '',
    };

    const actualWatchlist = watchlist.compileFor([defaultEnvironment, integrationEnvironment]);

    assert.deepEqual([
      'src/[E]xampleFour.php',
      'test/integration/src/[E]xampleFourTest.php',
      'test/unit/src/[E]xampleFourTest.php',
    ], actualWatchlist.sort());
  });

  function assertListsAreEqual(actual, expected) {
    assert.deepEqual(actual.sort(), expected.sort());
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
