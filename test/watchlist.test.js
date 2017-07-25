var assert = require('assert');
var Watchlist = require('../src/watchlist');

describe('watchlist', function() {
    var watchlist;

    beforeEach(function() {
        process.chdir('./test/mock-project');
        watchlist = new Watchlist();
    });

    afterEach(function() {
        process.chdir('./../../');
    });
    
    var invalidUseCases = [
        {dir: 'tset/unit'},
        {dir: 'test/units'},
    ];

    var validUseCases = [
        {args: './test/unit', expected: [
            './test/unit/src/ExampleFourTest.php',
            './src/ExampleFour.php',  
        ]},
        {args: './tests/unit', expected: [
            './tests/unit/src/ExampleTwoTest.php',
            './src/ExampleTwo.php',  
        ]},
        {args: 'test/unit', expected: [
            './test/unit/src/ExampleFourTest.php',
            './src/ExampleFour.php',  
        ]},
        {args: './test/unit/', expected: [
            './test/unit/src/ExampleFourTest.php',
            './src/ExampleFour.php',
        ]},
    ];

    invalidUseCases.forEach(function(test) {
        it('should throw error if given test directory does not exist (' + test.dir + ')', function() {
            assert.throws(function () {
                watchlist.compileFrom(test.dir);
            }, TypeError);
        });        
    });

    validUseCases.forEach(function(test) {
        it('should compile appropriate watchlist from "' + test.args + '" test directory', function() {
            var locationsToWatch = watchlist.compileFrom(test.args);

            assert.deepEqual(locationsToWatch, test.expected);
        });
    });
});
