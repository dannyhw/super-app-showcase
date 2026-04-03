module.exports = {
  ...require("./lib/federationDts"),
  getSharedDependencies: require("./lib/sharedDeps"),
  getWatchOptions: require("./lib/watchOptions"),
};
