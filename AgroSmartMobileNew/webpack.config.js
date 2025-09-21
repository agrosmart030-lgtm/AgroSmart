const path = require('path');
const { createWebpackConfig } = require('@react-native-community/cli');
const { getDefaultConfig } = require('metro-config');

module.exports = async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  const config = createWebpackConfig();

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'react-native$': 'react-native-web',
        'react-native-svg': 'react-native-svg-web',
      },
      extensions: ['.web.js', '.web.ts', '.web.tsx', ...config.resolve.extensions],
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules\/.*\/node_modules\/react-native/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
                'module:metro-react-native-babel-preset',
              ],
              plugins: [
                'react-native-web',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
                'react-native-reanimated/plugin',
              ],
            },
          },
        },
        {
          test: /\.(bmp|gif|jpg|jpeg|png|psd|svg|webp|m4v|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        },
      ],
    },
  };
};
