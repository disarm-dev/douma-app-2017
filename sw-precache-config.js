module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [/static\/api\/?(?:[^\/]+\/?)*$/],
  runtimeCaching: [
    {
      urlPattern: /\/static\/instances\/*/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /\/static\/local_areas\/*/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /static\/api\/?(?:[^\/]+\/?)*$/,
      handler: 'cacheFirst'
    }
  ],
  verbose: true
}


