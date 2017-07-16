import bwa from './bwa.presenters.js'
import nam from './nam.presenters.js'
import swz from './swz.presenters.js'
import zwe from './zwe.presenters.js'

export default {bwa, nam, swz, zwe}

// TODO: @refac convert presenters to dynamic import using CONFIG.instances.list
// import CONFIG from 'config/common'
// export default CONFIG.instances.list.reduce((acc, slug) => {
//   acc[slug] = require(`./${slug}.presenters.js`)
//   return acc
// }, {})
//
