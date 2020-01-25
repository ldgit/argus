module.exports = createRunCommandsSpy;

function createRunCommandsSpy() {
  let lastRunCommands = [];
  let totalCommandsBatchesRunCount = 0;

  const runCommands = commands => {
    lastRunCommands = commands;
    totalCommandsBatchesRunCount += 1;
  };

  runCommands.getLastRunCommands = () => lastRunCommands;
  runCommands.getCommandsBatchRunCount = () => totalCommandsBatchesRunCount;

  return runCommands;
}
