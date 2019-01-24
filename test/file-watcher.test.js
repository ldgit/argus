const assert = require('assert');
const path = require('path');
const { fork } = require('child_process');
const { configureCreateWatcher } = require('../src/file-watcher');
const { createPrinterSpy } = require('../src/printer');

const wait = time => new Promise(resolve => setTimeout(resolve, time));

describe('watcher', function watcherTest() {
  let watcher;
  let configuration;
  let environments;
  let printerSpy;

  this.slow(300);

  beforeEach(() => {
    environments = [createEnvironment('php')];
    configuration = {
      environments,
    };
    process.chdir(path.join('.', 'test'));
    printerSpy = createPrinterSpy();
    watcher = configureCreateWatcher(printerSpy, debounceDummy, configuration);
  });

  afterEach(() => {
    watcher.close();
    process.chdir(path.join('.', '..'));
  });

  it('should not call given callback if no files changed', () => {
    let callbackWasCalled = false;

    watcher.watchFiles(['./mock-project/src/ExampleFour.php'], () => {
      callbackWasCalled = true;
    });

    wait(30).then(() => assert.strictEqual(callbackWasCalled, false));
  });

  // Watchlist (input for watchFiles() function) also does this when it is compiled, but in this case it doesn't hurt
  // to doublecheck.
  it('should filter out paths that don\'t exist so that ready event will fire correctly', (done) => {
    watcher.watchFiles(['./mock-project/src/ExampleFour.php', './mock-project/src/DoesNotExist.php'], () => {});

    watcher.on('ready', () => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], { text: 'Watching 1 file(s)', type: 'info' });
      done();
    });
  });

  it('should print out information about the number of watched files', (done) => {
    environments.push(createEnvironment('js'));

    watcher.watchFiles([
      './mock-project/src/ExampleOne.php',
      './mock-project/src/ExampleFour.js',
    ], () => {});

    watcher.on('ready', () => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], { text: 'Watching 2 file(s)', type: 'info' });
      done();
    });
  });

  it('should not count same file twice when given multiple environments for same filetype', (done) => {
    environments.push(createEnvironment('php'));
    watcher.watchFiles(['./mock-project/src/ExampleOne.php'], () => {});
    watcher.on('ready', () => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], { text: 'Watching 1 file(s)', type: 'info' });
      done();
    });
  });

  it('should only watch files with supported extensions', (done) => {
    watcher.watchFiles(['./mock-project/src/Example.js'], () => {});
    watcher.on('ready', () => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], { text: 'Watching 0 file(s)', type: 'info' });
      done();
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
    watcher.watchFiles(['./mock-project/src/ExampleFour.php'], () => {
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

function debounceDummy(func) {
  return func;
}
