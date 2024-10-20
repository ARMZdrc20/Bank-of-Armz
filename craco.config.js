const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        buffer: require.resolve("buffer/"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        process: require.resolve('process/browser.js'), 
        vm: require.resolve("vm-browserify"),
        url: false
      };

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
      ];

      return webpackConfig;
    },
  },
};
