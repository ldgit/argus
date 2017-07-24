const spawnSync = require('child_process').spawnSync;

spawnSync('touch', [process.argv[2]]);