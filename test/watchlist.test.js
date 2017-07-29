const assert = require('assert');
const Watchlist = require('../src/watchlist');

describe('watchlist', () => {
  let watchlist;

  beforeEach(() => {
    process.chdir('./test/mock-project');
    watchlist = new Watchlist();
  });

  afterEach(() => {
    process.chdir('./../../');
  });

  const invalidUseCases = [
    { dir: 'tset/unit' },
    { dir: 'test/units' },
  ];

  const validUseCases = [
    { args: './test/unit', expected: ['./test/unit/src/[E]xampleFourTest.php', './src/[E]xampleFour.php'] },
    { args: './tests/unit', expected: ['./tests/unit/src/[E]xampleTwoTest.php', './src/[E]xampleTwo.php'] },
    { args: 'test/unit', expected: ['./test/unit/src/[E]xampleFourTest.php', './src/[E]xampleFour.php'] },
    { args: './test/unit/', expected: ['./test/unit/src/[E]xampleFourTest.php', './src/[E]xampleFour.php'] },
  ];

  invalidUseCases.forEach((test) => {
    it(`should throw error if given test directory does not exist (${test.dir})`, () => {
      assert.throws(() => {
        watchlist.compileFrom(test.dir);
      }, TypeError);
    });
  });

  validUseCases.forEach((test) => {
    it(`should compile watchlist of globified filepaths from "${test.args}" test directory`, () => {
      const locationsToWatch = watchlist.compileFrom(test.args);

      assert.deepEqual(locationsToWatch, test.expected);
    });
  });
});
