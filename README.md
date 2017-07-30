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
1. Install globally: ```npm install -g argus-test-runner```
30. Navigate to your project root and run ```argus```
40. Argus will now watch for changes in your source files and run the tests for you
50. To stop watching files just press ```Ctrl + C```
