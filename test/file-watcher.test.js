const assert = require('assert');
const { expect } = require('chai');
const path = require('path');
const { fork } = require('child_process');
const { configureCreateWatcher } = require('../src/file-watcher');
const { createPrinterSpy } = require('../src/printer');
const wait = require('./helpers/wait');

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

    return wait(30).then(() => assert.strictEqual(callbackWasCalled, false));
  });

  // Watchlist (input for watchFiles() function) also does this when it is compiled, but in this case it doesn't hurt
  // to doublecheck.
  it("should filter out paths that don't exist so that ready event will fire correctly", () => {
    watcher.watchFiles(
      ['./mock-project/src/ExampleFour.php', './mock-project/src/DoesNotExist.php'],
      () => {},
    );
    return new Promise(resolve => watcher.on('ready', resolve)).then(() => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], {
        text: 'Watching 1 file(s)',
        type: 'info',
      });
    });
  });

  it('should print out information about the number of watched files', () => {
    environments.push(createEnvironment('js'));

    watcher.watchFiles(
      ['./mock-project/src/ExampleOne.php', './mock-project/src/ExampleFour.js'],
      () => {},
    );

    return new Promise(resolve => watcher.on('ready', resolve)).then(() => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], {
        text: 'Watching 2 file(s)',
        type: 'info',
      });
    });
  });

  it('should not count same file twice when given multiple environments for same filetype', () => {
    environments.push(createEnvironment('php'));
    watcher.watchFiles(['./mock-project/src/ExampleOne.php'], () => {});

    return new Promise(resolve => watcher.on('ready', resolve)).then(() => {
      assert.deepStrictEqual(printerSpy.getPrintedMessages()[0], {
        text: 'Watching 1 file(s)',
        type: 'info',
      });
    });
  });

  it('should only watch files with supported extensions', () => {
    watcher.watchFiles(['./mock-project/src/Example.js'], () => {});

    return new Promise(resolve => {
      watcher.on('ready', resolve);
    }).then(() => {
      expect(printerSpy.getPrintedMessages()[0]).to.eql({
        text: 'Watching 0 file(s)',
        type: 'info',
      });
    });
  });

  it('should call given callback if a watched file changes and send changed path to callback', () => {
    const afterFileChanged = new Promise(resolve => {
      watcher.watchFiles(
        ['./mock-project/src/ExampleFileForFileWatcher.php'],
        pathToChangedFile => {
          resolve(pathToChangedFile);
        },
      );
    });

    // This seems to be the only option that triggers "on file change" callback. Watcher does not
    // seem to be able to detect that the file was changed by this node process (ie. the same
    // node process that test and watcher itself are running from). The file *needs* to be changed
    // by a different node.js process for this test to work.
    fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);

    return afterFileChanged.then(pathToChangedFile => {
      expectPath(pathToChangedFile).toEqual('mock-project/src/ExampleFileForFileWatcher.php');
    });
  });

  it('should call given callback if a file from a watchlist changes and send changed path to callback', () => {
    const watchlist = [
      './mock-project/src/ExampleFour.php',
      './mock-project/src/ExampleFileForFileWatcher.php',
    ];
    const afterFileChanged = new Promise(resolve => {
      watcher.watchFiles(watchlist, pathToChangedFile => {
        resolve(pathToChangedFile);
      });
    });

    fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);

    return afterFileChanged.then(pathToChangedFile => {
      expectPath(pathToChangedFile).toEqual('mock-project/src/ExampleFileForFileWatcher.php');
    });
  });

  it('should watch only files in given watchlist', () => {
    watcher.watchFiles(['./mock-project/src/ExampleFour.php'], () => {
      assert.fail('callback was called when it should not have been');
    });

    return new Promise(resolve => {
      fork('helpers/touch.js', ['./mock-project/src/Example.js']).on('exit', resolve);
    });
  });

  it('should watch files configured by environments extension property', () => {
    createEnvironment('js');
    const watchlist = [
      './mock-project/src/ExampleFileForFileWatcher.php',
      './mock-project/src/ExampleFour.js',
    ];
    const afterFileChanged = new Promise(resolve => {
      watcher.watchFiles(watchlist, pathToChangedFile => {
        resolve(pathToChangedFile);
      });
    });

    fork('helpers/touch.js', ['./mock-project/src/ExampleFour.js']);

    return afterFileChanged.then(pathToChangedFile => {
      expectPath(pathToChangedFile).toEqual('mock-project/src/ExampleFour.js');
    });
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

/**
 * Normalizes actual path so it uses linux dir separator "/".
 *
 * Separator is not important for these tests at the moment because test-finder
 * module takes care to use correct separator in production.
 */
function expectPath(actualPath) {
  return {
    toEqual: expectedPath => expect(actualPath.replace(/\\/g, '/')).to.equal(expectedPath),
  };
}
