const assert = require('assert');
const { expect } = require('chai');
const path = require('path');
const getCommandLineOptions = require('../src/command-line-options');
const { version } = require('./../package.json');

describe('command line options', () => {
  let processArgv;

  beforeEach(() => {
    processArgv = ['/usr/bin/nodejs', '/argus'];
  });

  it('should return default configuration file if no config file specified', () => {
    const commandLineOptions = getCommandLineOptions(processArgv);
    assert.equal(commandLineOptions.config, path.join(process.cwd(), 'argus.config.js'));
  });

  it('should get configuration file from command line', () => {
    processArgv.push('-c', 'custom.argus.config.js');
    const commandLineOptions = getCommandLineOptions(processArgv);
    assert.equal(commandLineOptions.config, path.join(process.cwd(), 'custom.argus.config.js'));
  });

  it('should normalize given absolute config path', () => {
    processArgv.push('-c', '/some///weird//path/to/argus.config.js');
    const commandLineOptions = getCommandLineOptions(processArgv);
    expect(commandLineOptions.config).to.equal(path.resolve(path.join('/some/weird/path/to/argus.config.js')));
  });

  it('should normalize given relative config path', () => {
    processArgv.push('-c', './weird//path///argus.config.js');
    const commandLineOptions = getCommandLineOptions(processArgv);
    expect(commandLineOptions.config).to.contain(path.join(process.cwd(), '/weird/path/argus.config.js'));
  });

  it('should use same version as package json', () => {
    const expectedVersion = version;
    const commandLineOptions = getCommandLineOptions(processArgv);
    assert.equal(commandLineOptions.version(), expectedVersion);
  });
});
