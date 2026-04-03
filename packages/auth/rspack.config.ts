import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import sdk from 'super-app-showcase-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const {
  getFederationDevConfig,
  getFederationDtsConfig,
  getSharedDependencies,
  getWatchOptions,
} = sdk;

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig(({mode}) => {
  return {
    mode,
    context: __dirname,
    entry: {},
    resolve: {...Repack.getResolveOptions({enablePackageExports: true})},
    output: {
      uniqueName: 'sas-auth',
    },
    watchOptions: getWatchOptions(),
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            parallel: true,
            options: {},
          },
          type: 'javascript/auto',
        },
        ...Repack.getAssetTransformRules({inline: true}),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'auth',
        filename: 'auth.container.js.bundle',
        dev: getFederationDevConfig(),
        dts: getFederationDtsConfig(__dirname, {consumeTypes: false}),
        exposes: {
          './AccountScreen': './src/screens/AccountScreen',
          './SignInScreen': './src/screens/SignInScreen',
          './AuthProvider': './src/providers/AuthProvider',
        },
        shared: getSharedDependencies({eager: false}),
      }),
      new Repack.plugins.CodeSigningPlugin({
        enabled: mode === 'production',
        privateKeyPath: path.join('..', '..', 'code-signing.pem'),
      }),
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };
});
