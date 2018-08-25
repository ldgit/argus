const path = require('path');
const program = require('commander');
const { version } = require('./../package.json');

module.exports = function getCommandLineOptions(processArgv) {
  program
    .version(version)
    .usage('[options]')
    .option('-c, --config [path]', 'configuration file path', 'argus.config.js')
    .parse(processArgv);

  return {
    config: path.resolve(program.config),
    version: () => program.opts().version,
  };
};
