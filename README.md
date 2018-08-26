Argus test runner
=================

[![npm](https://img.shields.io/npm/v/argus-test-runner.svg)](https://www.npmjs.com/package/argus-test-runner) [![Build Status](https://travis-ci.org/ldgit/argus.svg?branch=master)](https://travis-ci.org/ldgit/argus)

Watches your files and executes automated tests for them when they change.

## Note
These are the docs for **2.0.0** version. For **1.4.1** version documentation see [here](../1.4.1/README.md).

## Requirements
* [Node.js](https://nodejs.org/en/) v8.* or greater
* npm 5 or greater

## Installation

### Global installation
1. ```npm install -g argus-test-runner```
15. Navigate to your project root 
20. Create a configuration file named `argus.config.js` (see [configuration examples](#configuration-file-examples))
30. Type ```argus``` to start watching
50. Type ```argus -h``` for usage information

### Local installation
1. If you already have a package.json in your project, you can also install argus-test-runner locally
20. Navigate to your project root and type ```npm install --save-dev argus-test-runner```
25. Create a configuration file named `argus.config.js` (see [configuration examples](#configuration-file-examples))
30. Start Argus with ```./node_modules/.bin/argus```
40. You can also add an npm script for convenience in your package.json:
    ```json
        "devDependencies": {
          "argus-test-runner": "^2.0.0"
        },
        "scripts": {
          "argus": "argus"
        }
    ```
    and run ```npm run argus```

To stop watching files just press ```Ctrl + C```

## Configuration

You must configure argus-test-runner by creating a configuration file. By default, ```argus``` looks for the configuration file named ```argus.config.js``` in the directory in which it is run, but you can specify a different location via ```-c``` console parameter, for example ```argus -c ../my.custom.argus.config.js```.
Configuration files are written in *Javascript*.

### Configuration file examples:

#### Just PHPUnit unit tests:
```javascript
module.exports = {
  environments: [
    {
      // File extension, in this case we are watching PHP files
      extension: 'php',
      // Suffix by which test files are identified
      testNameSuffix: 'Test',
      // Test directory mirrors your source directory structure
      testDir: 'tests',
      sourceDir: 'src',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
  ],
};
```

#### PHPUnit unit and integration tests:
```javascript
module.exports = {
  environments: [
    // Unit test environment
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: 'src',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
    // Integration environment
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/integration',
      sourceDir: 'src',
      // If you are using a different configuration file for your integration tests, you can specify it in the
      // arguments list
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: ['-c', 'phpunit-integration.xml'] },
    },
  ],
};
```

#### PHPUnit unit tests and Javascript unit tests:
```javascript
module.exports = {
  environments: [
    // PHPUnit test environment
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/unit',
      sourceDir: 'src',
      testRunnerCommand: { command: 'vendor/bin/phpunit', arguments: [] },
    },
    // Javascript unit test environment
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'tests/unit',
      sourceDir: 'src',
      // If you are using mocha for your Javascript tests
      testRunnerCommand: { command: 'node_modules/.bin/mocha', arguments: [] },
      // You can define a custom command to run all tests (runs when you press "a" when Argus is running).
      // Otherwise Argus will use testRunnerCommand and its arguments to run all tests.
      runAllTestsCommand: { command: 'npm', arguments: ['t'] },
    },
  ],
};
```
