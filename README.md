Argus test runner
=================

[![npm](https://img.shields.io/npm/v/argus-test-runner.svg)](https://www.npmjs.com/package/argus-test-runner) [![Build Status](https://travis-ci.org/ldgit/argus.svg?branch=master)](https://travis-ci.org/ldgit/argus)

Watches your files and executes automated tests for them when they change.

## Requirements
* [Node.js](https://nodejs.org/en/) v6.* or greater
* npm 3 or greater

## Installation

### Global installation
1. ```npm install -g argus-test-runner```
30. Navigate to your project root and type ```argus``` to start watching
50. Type ```argus -h``` for usage information

### Local installation
1. If you already have a package.json in your project, you can also install argus-test-runner locally
20. Navigate to your project root and type ```npm install --save-dev argus-test-runner```
30. Start Argus with ```./node_modules/.bin/argus```
40. You can also add an npm script for convenience in your package.json:
    ```json
        "devDependencies": {
          "argus-test-runner": "^1.1.1"
        },
        "scripts": {
          "argus": "argus"
        }
    ```
    and run ```npm run argus```

To stop watching files just press ```Ctrl + C```

## Configuration

### Default configuration (**deprecated**)
Default configuration is set up so that:
* [PHPUnit](https://phpunit.de/) tests are run (using ```vendor/bin/phpunit```)
* your project must keep it's tests in one of these four locations:
  1. tests/unit/
  20. test/unit/
  30. tests/
  40. test/
* test file names must end with ```*Test.php```
* directory structure inside your project test directory must mirror project root directory for tests to be found

**Default configuration is deprecated**, from version **2.0.0** and up you **will** have to specify a config file.

### Custom configuration
You can define your own custom configuration by creating a configuration file. By default, ```argus``` looks for the configuration file named ```argus.config.js``` in the directory in which it is run, but you can specify a different location via ```-c``` console parameter, for example ```argus -c ../my.custom.argus.config.js```.
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
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
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
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    // Integration environment
    {
      extension: 'php',
      testNameSuffix: 'Test',
      testDir: 'tests/integration',
      sourceDir: 'src',
      // If you are using a different configuration file for your integration tests, you can specify it in the
      // arguments list
      arguments: ['-c', 'phpunit-integration.xml'],
      testRunnerCommand: 'vendor/bin/phpunit',
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
      arguments: [],
      testRunnerCommand: 'vendor/bin/phpunit',
    },
    // Javascript unit test environment
    {
      extension: 'js',
      testNameSuffix: '.test',
      testDir: 'tests/unit',
      sourceDir: 'src',
      arguments: [],
      // If you are using mocha for your Javascript tests
      testRunnerCommand: 'node_modules/.bin/mocha',
    },
  ],
};
```
