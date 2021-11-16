module.exports = {
  reactStrictMode: true,
  // Fix fast refresh for Windows users
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
};
