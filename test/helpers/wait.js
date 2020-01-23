const wait = miliseconds => new Promise(resolve => setTimeout(resolve, miliseconds));

module.exports = wait;
