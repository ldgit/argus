const assert = require('assert');
const path = require('path');
const { configureCreateWatcher } = require('../src/file-watcher');
const { nullPrinter } = require('../src/printer');

const { fork } = require('child_process');

describe('watcher', function watcherTest() {
  let watcher;
  let configuration;
  let environments;
  let infos;

  this.slow(300);

  beforeEach(() => {
    infos = [];
    environments = [createEnvironment('php')];
    configuration = {
      environments,
      configFileFound: true,
    };
    process.chdir(path.join('.', 'test'));
    watcher = configureCreateWatcher(nullPrinter, configuration);
  });

  afterEach(() => {
    watcher.close();
    process.chdir(path.join('.', '..'));
  });

  it('should not call given callback if no files changed', () => {
    let callbackWasCalled = false;

    watcher.watchFiles(['./mock-project/src/[E]xampleFour.php'], () => {
      callbackWasCalled = true;
    });

    assert.strictEqual(callbackWasCalled, false);
  });

  context('when given an array of "globified" file paths', () => {
    // Watchlist (input for watchFiles() function) also does this when it is compiled, but in this case it doesn't hurt
    // to doublecheck.
    it('should filter out paths that don\'t exist so that ready event will fire correctly', (done) => {
      nullPrinter.info = text => infos.push(text);

      watcher.watchFiles(['./mock-project/src/[E]xampleFour.php'], () => {});

      watcher.on('ready', () => {
        assert.equal(infos[0], 'Watching 1 file(s)');
        done();
      });
    });

    it('should print out information about the number of watched files', (done) => {
      environments.push(createEnvironment('js'));
      nullPrinter.info = text => infos.push(text);

      watcher.watchFiles([
        './mock-project/src/[E]xampleOne.php',
        './mock-project/src/[E]xampleFour.js',
      ], () => {});

      watcher.on('ready', () => {
        assert.equal(infos[0], 'Watching 2 file(s)');
        done();
      });
    });

    it('should a print warning if configuration file not found', (done) => {
      configuration.configFileFound = false;
      const warnings = [];
      nullPrinter.warning = text => warnings.push(text);

      watcher.watchFiles([
        './mock-project/src/[E]xampleOne.php', // exists
        './mock-project/nonexistent/[p]ath',
      ], () => {});

      watcher.on('ready', () => {
        assert.equal(warnings[0], 'Configuration file not found, will use default configuration.');
        done();
      });
    });

    it('should not count same file twice when given multiple environments for same filetype', (done) => {
      environments.push(createEnvironment('php'));
      nullPrinter.info = text => infos.push(text);

      watcher.watchFiles(['./mock-project/src/[E]xampleOne.php'], () => {});

      watcher.on('ready', () => {
        assert.equal(infos[0], 'Watching 1 file(s)');
        done();
      });
    });
  });

  it('should call given callback if a watched file changes and send changed path to callback', (done) => {
    watcher.watchFiles(['./mock-project/src/ExampleFileForFileWatcher.php'], (pathToChangedFile) => {
      assert.equal('mock-project/src/ExampleFileForFileWatcher.php', pathToChangedFile);
      done();
    });

    // This seems to be the only option that triggers "on file change" callback. Watcher does not
    // seem to be able to detect that the file was changed by this node process (ie. the same
    // node process that test and watcher itself are running from). The file *needs* to be changed
    // by a different node.js process for this test to work.
    fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);
  });

  it('should call given callback if a file from a watchlist changes and send changed path to callback', (done) => {
    const watchlist = ['./mock-project/src/ExampleFour.php', './mock-project/src/ExampleFileForFileWatcher.php'];
    watcher.watchFiles(watchlist, (pathToChangedFile) => {
      assert.equal('mock-project/src/ExampleFileForFileWatcher.php', pathToChangedFile);
      done();
    });

    fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);
  });

  it('should watch only files in given watchlist', (done) => {
    watcher.watchFiles(['./mock-project/src/[E]xampleFour.php'], () => {
      assert.fail('callback was called when it should not have been');
    });

    fork('helpers/touch.js', ['./mock-project/src/Example.js']).on('exit', () => {
      done();
    });
  });

  it('should watch files configured by environments extension property', (done) => {
    createEnvironment('js');
    const watchlist = ['./mock-project/src/ExampleFileForFileWatcher.php', './mock-project/src/ExampleFour.js'];
    watcher.watchFiles(watchlist, (pathToChangedFile) => {
      assert.equal('mock-project/src/ExampleFour.js', pathToChangedFile);
      done();
    });

    fork('helpers/touch.js', ['./mock-project/src/ExampleFour.js']);
  });

  function createEnvironment(fileExtension) {
    return {
      extension: fileExtension,
      testNameSuffix: 'not important',
      testDir: 'not important',
      sourceDir: 'not important',
      arguments: [],
      testRunnerCommand: 'not important',
    };
  }
});
