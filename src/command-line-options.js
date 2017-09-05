const path = require('path');
const program = require('commander');

module.exports = function CommandLineOptions(processArgv) {
  program
    .version(require('./../package.json').version)
    .usage('[options]')
    .option('-c, --config [path]', 'configuration file path', 'argus.config.js')
    .parse(processArgv);

  return {
    config: path.resolve(program.config),
    version: program.opts().version,
  };
};
