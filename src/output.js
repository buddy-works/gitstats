const chalk = require('chalk');
const cliui = require('cliui');

module.exports.output = (txt) => {
  const ui = cliui({
    width: 100,
  });
  ui.div(txt);
  console.log(ui.toString());
};

module.exports.error = txt => this.output(chalk.red(txt));
