const path = require('path');
const shell = require('shelljs');

const paths = shell
  .find('./node_modules')
  .filter(file => file.match(/ethers$/));

for (const _path of paths) {
  console.log(`Patching path: ${path.join(_path, '/package.json')}`);
  shell.sed(
    '-i',
    /"browser": ".\/dist\/ethers.js"/g,
    '"browser": "./dist/ethers.min.js"',
    path.join(_path, '/package.json')
  );
}
