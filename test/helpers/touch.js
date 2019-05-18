const path = require('path');
const touch = require('touch');

touch(path.join(process.argv[2]));
