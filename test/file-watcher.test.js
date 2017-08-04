const assert = require('assert');
const path = require('path');
const Watcher = require('../src/file-watcher');
const nullPrinter = require('../src/printer').createNull();

const { fork } = require('child_process');

describe('watcher', function watcherTest() {
  let watcher;

  this.slow(300);

  beforeEach(() => {
    process.chdir(path.join('.', 'test'));
    watcher = new Watcher(nullPrinter);
  });

  afterEach(() => {
    watcher.close();
    process.chdir(path.join('.', '..'));
  });

  it('should not call given callback if no files changed', () => {
    let callbackWasCalled = false;

    watcher.watchPhpFiles('./mock-project', () => {
      callbackWasCalled = true;
    });

    assert.strictEqual(callbackWasCalled, false);
  });

  it('should throw error if path is string and does not exist', () => {
    assert.throws(() => {
      watcher.watchPhpFiles('./mock-project/nonexistent/path', () => {});
    }, TypeError);
  });

  context('when given an array of "globified" file paths', () => {
    it('should print out a warning if any file path does not exist', () => {
      const warnings = [];
      nullPrinter.warning = (text) => {
        warnings.push(text);
      };

      watcher.watchPhpFiles([
        './mock-project/src/[E]xampleFour.php', // Exists
        './mock-project/nonexistent/[p]ath',
      ], () => {});

      assert.equal(warnings[0], 'File not found: "./mock-project/nonexistent/path"');
    });

    it('should filter out paths that don\'t exist so that ready event will fire correctly', (done) => {
      const info = [];
      nullPrinter.info = (text) => {
        info.push(text);
      };

      watcher.watchPhpFiles(['./mock-project/src/[E]xampleFour.php'], () => {});

      watcher.on('ready', () => {
        assert.equal(info[0], 'Watching 1 file(s)');
        done();
      });
    });

    it('should print out information about the number of watched files', (done) => {
      const infos = [];
      nullPrinter.info = (text) => {
        infos.push(text);
      };

      watcher.watchPhpFiles(['./mock-project/src/[E]xampleOne.php'], () => {});

      watcher.on('ready', () => {
        assert.equal(infos[0], 'Watching 1 file(s)');
        done();
      });
    });
  });

  it('should call given callback if a watched file changes and send changed path to callback', (done) => {
    watcher.watchPhpFiles('./mock-project', (pathToChangedFile) => {
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
    watcher.watchPhpFiles(watchlist, (pathToChangedFile) => {
      assert.equal('mock-project/src/ExampleFileForFileWatcher.php', pathToChangedFile);
      done();
    });

    fork('helpers/touch.js', ['./mock-project/src/ExampleFileForFileWatcher.php']);
  });

  it('should watch only php files', (done) => {
    watcher.watchPhpFiles('./mock-project', () => {
      assert.fail('callback was called when it should not have been');
    });

    fork('helpers/touch.js', ['./mock-project/src/Example.js']).on('exit', () => {
      done();
    });
  });

  it('should ignore vendor directory', (done) => {
    watcher.watchPhpFiles('./mock-project', () => {
      assert.fail('callback was called when it should not have been');
    });

    fork('helpers/touch.js', ['./mock-project/vendor/VendorFile.php']).on('exit', () => {
      done();
    });
  });
});

