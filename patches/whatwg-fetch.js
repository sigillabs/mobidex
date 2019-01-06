const shell = require('shelljs');

const paths = shell
  .find('./node_modules')
  .filter(file => file.match('fetch.umd.js'));

for (const _path of paths) {
  console.log(`Patching path: ${_path}`);
  shell.sed('-i', /self/g, 'global', _path);
}
