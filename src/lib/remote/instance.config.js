import {standard_handler} from './remote.standard-handler.js'
import {InstanceConfigSchema} from '../models/instance_config.schema'


// Instance configuration and related files
export const get_instance_files = (slug) => {
  const urls = [
    `/static/instances/${slug}.instance.json`,
    `/static/instances/${slug}.form.json`,
    `/static/instances/${slug}.location_selector.json`,
    `/static/instances/${slug}.aggregations.json`,
  ]

  let options = {
    timeout: 20000
  }

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(jsons => {
      let instance_config = jsons[0]

      const errors = InstanceConfigSchema.errors(instance_config)

      if (errors) {
        const message = "Invalid instance_config"
        console.error(errors)
        alert(message + ": If this happens when you reload, please report as an urgent bug! Thanks")
        throw new Error(message)
      }

      // Other elements to attach
      const form = jsons[1]
      const location_selection = jsons[2]
      const aggregations = jsons[3]

      instance_config = {
        ...instance_config,
        ...form,
        ...location_selection,
        ...aggregations
      }

      return instance_config
    })

}

