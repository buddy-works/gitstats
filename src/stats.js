const output = require('./output');
const nodegit = require('nodegit');

const stats = {
  committers: {},
  startDate: null,
  totalHours: 0,
  totalCommits: 0,
  hours: {},
  hoursCount: {},
};

const render = () => {
  let txt = `Project started:\t ${stats.startDate.toISOString()}\n`;
  txt += `Commits:\t ${stats.totalCommits}\n`;
  txt += `Hours:\t ${stats.totalHours}\n\n`;
  txt += 'Contributor\t Commits\t Hours\n';
  const data = [];
  Object.keys(stats.committers).forEach((committer) => {
    data.push({
      name: committer,
      commits: stats.committers[committer],
      hours: stats.hoursCount[committer],
    });
  });
  data.sort((a, b) => (a.commits > b.commits ? -1 : 1));
  for (let i = 0; i < data.length; i += 1) {
    txt += `${data[i].name}\t ${data[i].commits}\t ${data[i].hours}\n`;
  }
  output.output(txt);
};

const getCommitterName = (committer) => {
  let name = committer.email();
  if (!name) name = committer.name();
  return name;
};

const commit2stats = (commit) => {
  const commiter = getCommitterName(commit.committer());
  const date = commit.date();
  const day = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const hours = date.getHours();
  if (!stats.committers[commiter]) stats.committers[commiter] = 1;
  else stats.committers[commiter] += 1;
  if (!stats.startDate) stats.startDate = date;
  else if (stats.startDate.getTime() > date.getTime()) stats.startDate = date;
  if (!stats.hours[commiter]) stats.hours[commiter] = {};
  if (!stats.hoursCount[commiter]) stats.hoursCount[commiter] = 0;
  if (!stats.hours[commiter][day]) stats.hours[commiter][day] = {};
  if (!stats.hours[commiter][day][hours]) {
    stats.hours[commiter][day][hours] = true;
    stats.hoursCount[commiter] += 1;
    stats.totalHours += 1;
  }
  stats.totalCommits += 1;
  commit.free();
};

module.exports = (repo) => {
  repo.fetchAll()
  .then(() => {
    repo.getHeadCommit()
    .then((headCommit) => {
      const history = headCommit.history(nodegit.Revwalk.SORT.TIME);
      history.on('commit', commit2stats);
      history.on('error', output.error);
      history.on('end', render);
      history.start();
    }, output.error);
  }, output.error);
};
