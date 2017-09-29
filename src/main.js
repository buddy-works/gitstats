const fs = require('fs');
const nodegit = require('nodegit');
const stats = require('./stats');
const output = require('./output');

module.exports = () => {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    output.error('Pass only one path as argument');
    return;
  }
  const path = args[0];
  if (!fs.existsSync(path)) {
    output.error('Provided path doesn\'t exists');
    return;
  }
  if (!fs.statSync(path).isDirectory()) {
    output.error('Provided path is not directory');
    return;
  }
  nodegit.Repository.open(path)
  .then(stats, output.error);
};
