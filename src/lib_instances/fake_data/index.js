import CONFIG from 'config/common'

export default CONFIG.instances.list.reduce((acc, slug) => {
  acc[slug] = require(`./${slug}.fake_form.json`)
  return acc
}, {})
