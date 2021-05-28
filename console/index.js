
// color constants for console logs

const chalk =   require('chalk')

const g = chalk.green.bind(chalk);
const b = chalk.blue.bind(chalk);
const gr = chalk.grey.bind(chalk);
const r = chalk.red.bind(chalk);
const y = chalk.yellow.bind(chalk);

module.exports = {
  g,
  b,
  gr,
  r,
  y
}
