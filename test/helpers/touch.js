const { spawnSync } = require('child_process');

spawnSync('touch', [process.argv[2]]);
