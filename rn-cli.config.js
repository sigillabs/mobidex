const path = require("path");
const blacklist = require("metro-bundler").createBlacklist;
const extraNodeModules = require("node-libs-react-native");

module.exports = {
  extraNodeModules,
  // postProcessModules: (modules, entrypoint) => {
  //   let index = 0;
  //   for (; index < modules.length; ++index) {
  //     if (modules[index].path.indexOf("@0xproject/connect/node_modules/isomorphic-fetch/fetch-npm-browserify.js") !== -1) {
  //       break;
  //     }
  //   }

  //   if (index === modules.length) {
  //     return modules;
  //   }

  //   console.log(modules[index]);

  //   modules.splice(index, 1, require("isomorphic-fetch"));

  //   return modules;
  // },
};