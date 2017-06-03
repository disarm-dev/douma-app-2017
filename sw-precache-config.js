module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [/\/static\/(geo|instances|structure_samples)\/?(?:[^\/]+\/?)*$/],
  runtimeCaching: [
    {
      urlPattern: /\/static\/(geo|instances|structure_samples)\/?(?:[^\/]+\/?)*$/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: '/^https\:\/\/douma-api\.herokuapp.com\/v3',
      handler: 'cacheFirst'
    }
  ],
  verbose: true
}


