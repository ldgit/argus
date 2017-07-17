const { spawn, spawnSync, fork } = require('child_process');

spawnSync('touch', ['./fixtures/src/Example.php']);