const path = require('node:path');

/**
 * Build a shared Module Federation DTS config for this monorepo.
 *
 * @param {string} rootDir Absolute path to the package root.
 * @param {{ consumeTypes?: boolean, generateTypes?: boolean }} options
 * @returns {import('@module-federation/enhanced').ModuleFederationPluginOptions['dts']}
 */
const getFederationDtsConfig = (
  rootDir,
  {consumeTypes = true, generateTypes = true} = {},
) => {
  const tsConfigPath = path.join(rootDir, 'tsconfig.json');

  return {
    generateTypes: generateTypes
      ? {
          tsConfigPath,
          abortOnError: false,
        }
      : false,
    consumeTypes: consumeTypes
      ? {
          abortOnError: false,
        }
      : false,
    tsConfigPath,
    cwd: rootDir,
    displayErrorInTerminal: true,
  };
};

const getFederationDevConfig = () => ({
  disableDynamicRemoteTypeHints: true,
});

module.exports = {
  getFederationDevConfig,
  getFederationDtsConfig,
};
