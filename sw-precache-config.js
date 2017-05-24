module.exports = {
  cacheId: 'douma',
  root: 'dist',
  maximumFileSizeToCacheInBytes: 14194304,
  navigateFallback: 'index.html',
  importScripts: ['offline-analytics.js'],
  runtimeCaching: [
    {
      urlPattern: /\/static\/instances\/*/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /\/static\/local_areas\/*/,
      handler: 'cacheFirst'
    }
  //   {
  //     urlPattern: /https:\/\/douma-api\.herokuapp.com\/v2\/local_areas\/*/,
  //     handler: 'cacheFirst'
  //   },
  //   {
  //     urlPattern: /https:\/\/douma-api\.herokuapp.com\/v2\/clusters\/all\/*/,
  //     handler: 'fastest'
  //   },
  //   {
  //     urlPattern: /https:\/\/douma-api\.herokuapp\.com\/v2\/tasks\/count/,
  //     handler: 'fastest'
  //   }
  ],
  verbose: true
}

