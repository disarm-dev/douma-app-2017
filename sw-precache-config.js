module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  staticFileGlobsIgnorePatterns: [
    /\/static\/instances\/?(?:[^\/]+\/?)*$/,
    /VERSION/,
    /COMMITHASH/
  ],
  runtimeCaching: [
    {
      urlPattern: /\/static\/instances\/?(?:[^\/]+\/?)*$/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /(api|tiles)\.mapbox\.com/,
      handler: 'cacheFirst'
    }
  ],
  skipWaiting: true
}

