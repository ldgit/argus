module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'test/unit',
      sourceDir: 'src',
      arguments: ['-v'],
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
  ],
};
