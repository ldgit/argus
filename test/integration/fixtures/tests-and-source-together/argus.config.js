module.exports = {
  environments: [
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'src',
      sourceDir: 'src',
      testRunnerCommand: { command: 'echo "I test thee"' },
    },
  ],
};
