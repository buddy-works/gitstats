const output = require('./output');

module.exports = (repo) => {
  repo.getMasterCommit()
  .then((commit) => {
    console.log('commit', commit);
  }, output.error);
};
