const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const nextConfig = {
  reactStrictMode: true,
  webpack5: false,
};

module.exports = withPlugins([
  [withLess, {
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          "primary-color": "#3C185C",
          // "success-color": "#0CCA4A",
          // "error-color": "#DB2B39",
          // "text-color": "#4C5F6B",
          "font-family": "Kanit"
        },
        javascriptEnabled: true
      },
    },
  }]
], nextConfig
);
