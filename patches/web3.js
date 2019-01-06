const shell = require('shelljs');

const paths = shell
  .find('./node_modules')
  .filter(file => file.match('web3/lib/utils') && file.match('utils.js'));

for (const _path of paths) {
  console.log(`Patching path: ${_path}`);
  shell.sed(
    '-i',
    /object.constructor.name === 'BigNumber'/,
    'object.s !== undefined && object.e !== undefined && object.c !== undefined',
    _path
  );
}
