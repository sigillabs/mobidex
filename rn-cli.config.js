const extraNodeModules = require('node-libs-react-native');
const blacklist = require('metro/src/blacklist');

module.exports = {
  extraNodeModules,
  getBlacklistRE() {
    return blacklist([/react-native\/local-cli\/core\/__fixtures__.*/]);
  }
};
