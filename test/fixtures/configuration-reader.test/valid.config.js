module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: 'src',
      testRunnerCommand: { command: 'node_modules/.bin/mocha', arguments: ['-v'] },
    },
  ],
};
