module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [/static\/(instances|geo|structure_sample).*/],
  runtimeCaching: [
    {
      urlPattern: /static\/(instances|geo|structure_sample).*/,
      handler: 'cacheFirst'
    }
  ],
  verbose: true
}


