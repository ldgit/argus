Argus
=====

Watches PHP files and executes [PHPUnit](https://phpunit.de/) unit tests for them (if it finds any).

**Notice:** this software is still in alpha phase, expect lots of bugs.

## Requirements
* [Node.js](https://nodejs.org/en/) v6.* or greater
* [Yarn](https://yarnpkg.com/en/) or npm 3 or greater
* your project must keep it's tests in one of four locations (in that order):
  1. tests/
  20. tests/unit/
  30. test/
  40. test/unit/
* test file names must end with ```*Test.php```
* directory structure inside your project test directory must mirror project root directory for tests to be found

## How to use
1. clone or download this repository
10. ```cd``` into repo directory
20. run ```yarn``` (or ```npm install```)
30. navigate to your project root and run ```node {path_to_argus_index.js_file}``` 
40. Argus should now watch for changes in your source files and run the tests for you
