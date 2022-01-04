const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync
const chalk = require('chalk')

function exec(cmd) {
  execSync(cmd, { stdio: 'inherit', env: process.env })
}
const packagesPath = path.resolve(__dirname, '../packages/')
const cwd = process.cwd()
const argv = process.argv

let script = ''
for (const arg of argv.slice(2, argv.length)) {
  if (arg.substring('script=') !== -1) {
    script = arg.split('=')[1]
  }
}

const files = fs.readdirSync(packagesPath)
const pkgDirs = []
for (const file of files) {
  const filePath = path.resolve(packagesPath, file)
  if (fs.lstatSync(filePath).isDirectory()) {
    pkgDirs.push(filePath)
  }
}

const executedList = []
const unexecutedList = []
pkgDirs.forEach(packagePath => {
  const pkg = require(path.join(packagePath, 'package.json'))

  if (pkg.scripts && pkg.scripts[script]) {
    executedList.push(path.basename(packagePath))

    process.chdir(packagePath)

    exec(`npm run ${script}`)
  } else {
    unexecutedList.push(path.basename(packagePath))
  }
})

process.chdir(cwd)
console.log(`
  script: ${script}
  ${chalk.keyword('orange')('unexecuted:')}${unexecutedList.join('\n\r\t')}
  ${chalk.green('executed:')}${executedList.join('\n\r\t   ')}
`)
