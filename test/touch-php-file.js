const spawnSync = require('child_process').spawnSync;

spawnSync('touch', ['./fixtures/src/ExampleFileForFileWatcher.php']);
