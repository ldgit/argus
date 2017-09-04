const path = require('path');
const program = require('commander');

module.exports = function CommandLineOptions(processArgv) {
  program
    .version(require('./../package.json').version)
    .option('-c, --config [path]', 'Configuration file path', 'argus.config.js')
    .parse(processArgv);

  return {
    config: path.resolve(program.config),
    version: program.opts().version,
  };
};
