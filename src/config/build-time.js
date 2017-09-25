// See `webpack.base.conf.js`

// Set some defaults for testing, and anything else that doesn't use webpack
const __VERSION_COMMIT_HASH_SHORT = 'DEFAULT FOR TESTING'
const __BRANCH = 'DEFAULT FOR TESTING'
const __DOUMA_PRODUCTION_MODE = true
const __GA_ANALYTICS_UA = ''

export default {
  VERSION_COMMIT_HASH_SHORT: __VERSION_COMMIT_HASH_SHORT,
  BRANCH: __BRANCH,
  DOUMA_PRODUCTION_MODE: __DOUMA_PRODUCTION_MODE,
  GA_ANALYTICS_UA: __GA_ANALYTICS_UA
}
