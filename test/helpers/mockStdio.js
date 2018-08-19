const Writable = require('stream').Writable;
const Readable = require('stream').Readable;

class StdoutMock extends Writable {
  constructor(options) {
    super(options);
    this.writtenStuff = [];
  }

  _write(chunk, encoding, callback) {
    this.writtenStuff.push(chunk);
    callback();
  }

  getWrittenStuff() {
    return this.writtenStuff;
  }
}

class StdinMock extends Readable {
  constructor(options) {
    super(options);
    this.rawMode = false;
    this.encoding = 'not utf 8';
  }

  /* eslint-disable-next-line class-methods-use-this */
  _read() {}

  setRawMode(isRaw) {
    this.rawMode = isRaw;
  }

  setEncoding(encoding) {
    super.setEncoding(encoding);
    this.encoding = encoding;
  }

  getEncoding() {
    return this.encoding;
  }

  isInRawMode() {
    return this.rawMode;
  }
}

module.exports = { StdoutMock, StdinMock };
