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
  images: {
    // TODO: Replace this with the URL of the fleek gateway ipfs
    domains: ['via.placeholder.com'],
  },
};
