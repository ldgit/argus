const readline = require('readline');

module.exports = function configureListenForInput(stdin, stdout) {
  return listenForInput.bind(null, stdin, stdout);
};

function listenForInput(stdin, stdout) {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  return new Promise((resolve) => {
    rl.question('What do you think of Node.js? ', (answer) => {
      resolve(answer);
    });
  });
}
