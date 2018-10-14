const extraNodeModules = require('node-libs-react-native');
let blacklist;
try {
  // >= 0.57
  blacklist = require('metro-config/src/defaults/blacklist');
} catch (e) {
  // <= 0.56
  blacklist = require('metro/src/blacklist');
}

module.exports = {
  resolver: {
    extraNodeModules,
    blacklistRE: blacklist([/react-native\/local-cli\/core\/__fixtures__.*/])
  }
};
