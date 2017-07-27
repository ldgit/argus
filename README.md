Argus
=====

[![Build Status](https://travis-ci.org/ldgit/argus.svg?branch=master)](https://travis-ci.org/ldgit/argus)

Watches PHP files and executes [PHPUnit](https://phpunit.de/) unit tests for them (if it finds any).

**Notice:** this software is still in alpha phase, expect lots of bugs.

## Requirements
* [Node.js](https://nodejs.org/en/) v6.* or greater
* [Yarn](https://yarnpkg.com/en/) or npm 3 or greater
* your project must keep it's tests in one of these four locations:
  1. tests/unit/
  20. test/unit/
  30. tests/
  40. test/
* test file names must end with ```*Test.php```
* directory structure inside your project test directory must mirror project root directory for tests to be found

## How to use
1. clone or download this repository
10. ```cd``` into repo directory
20. run ```yarn install --production``` (or ```npm install --production```)
30. navigate to your project root and run ```node {path_to_argus_index.js_file}``` 
40. Argus should now watch for changes in your source files and run the tests for you
