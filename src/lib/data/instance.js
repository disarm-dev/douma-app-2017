import {standard_handler} from './standard-handler.js'
import {InstanceConfigSchema} from '../models/instance_config.schema'


// Instance configuration and related files
export const get_instance_files = (slug) => {
  const urls = [
    `/static/instances/${slug}.instance.json`,
    `/static/instances/${slug}.form.json`,
    `/static/instances/${slug}.location_selector.json`,
  ]

  let options = {
    timeout: 20000
  }

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(jsons => {
      const instance_config = jsons[0]
      const errors = InstanceConfigSchema.errors(instance_config)

      if (errors) {
        const message = "Invalid instance_config"
        console.error(errors)
        alert(message + ": Please report this as an urgent bug.")
        throw new Error(message)
      }

      const form = jsons[1]
      const location_selection = jsons[2]

      instance_config.form = form
      instance_config.location = location_selection

      return instance_config
    })

}

