const Writable = require('stream').Writable;
const Readable = require('stream').Readable;

class WriteableMock extends Writable {
  _write(chunk, encoding, callback) {
    this.writtenStuff = chunk;
    callback();
  }

  getWrittenStuff() {
    return this.writtenStuff;
  }
}

class ReadableMock extends Readable {
  /* eslint-disable-next-line class-methods-use-this */
  _read() {}
}

module.exports = { WriteableMock, ReadableMock };
