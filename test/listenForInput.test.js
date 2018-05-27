const assert = require('assert');
const { WriteableMock, ReadableMock } = require('./helpers/mockStdio');
const configureListenForInput = require('./../src/listenForInput');

describe('listenForInput', () => {
  let mockStdin;
  let mockStdout;
  let listenForInput;

  beforeEach(() => {
    mockStdin = new ReadableMock({ decodeStrings: false });
    mockStdout = new WriteableMock({ decodeStrings: false });
    listenForInput = configureListenForInput(mockStdin, mockStdout);
  });

  it('should return promise that resolves with user input', () => {
    const promise = listenForInput().then(input => assert.equal(input, 'testing'));
    mockStdin.push('testing\n');
    return promise;
  });

  it('should list possible options', () => {
    listenForInput().then(input => assert.equal(input, 'testing'));
    assert.deepEqual(mockStdout.getWrittenStuff(), ['Press a to run all tests']);
  });
});
