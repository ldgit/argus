Argus test runner
=================

[![npm](https://img.shields.io/npm/v/argus-test-runner.svg)](https://www.npmjs.com/package/argus-test-runner) [![Build Status](https://travis-ci.org/ldgit/argus.svg?branch=master)](https://travis-ci.org/ldgit/argus)

Watches PHP files and executes [PHPUnit](https://phpunit.de/) unit tests for them (if it finds any).

## Requirements
* [Node.js](https://nodejs.org/en/) v6.* or greater
* npm 3 or greater
* your project must keep it's tests in one of these four locations:
  1. tests/unit/
  20. test/unit/
  30. tests/
  40. test/
* test file names must end with ```*Test.php```
* directory structure inside your project test directory must mirror project root directory for tests to be found

## Installation and usage

### Global installation
1. ```npm install -g argus-test-runner```
30. Navigate to your project root and type ```argus``` to start watching

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
