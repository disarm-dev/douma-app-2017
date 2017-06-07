module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [
    /\/static\/(geo|instances|structure_samples)\/?(?:[^\/]+\/?)*$/,
    /\/static\/network_test\.txt/
  ],
  runtimeCaching: [
    {
      urlPattern: /\/static\/(geo|instances|structure_samples)\/?(?:[^\/]+\/?)*$/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /api\.mapbox\.com/,
      handler: 'cacheFirst'
    }
  ],
  verbose: true
}


