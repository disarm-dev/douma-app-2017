import {get_instance_file} from 'lib/remote/remote.instance'
import {InstanceConfigSchema} from 'lib/models/instance_config.schema'


// Instance configuration and related files
export const get_instance_files = (slug) => {
  const types = ['instance', 'form', 'location_selector', 'aggregations', 'fake_form', 'validations']

  return Promise.all(types.map(type => get_instance_file(slug, type)))
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
      const fake_form = jsons[4]
      const validations = jsons[5]

      instance_config = {
        ...instance_config,
        form,
        location_selection,
        aggregations,
        fake_form,
        validations,
      }

      return instance_config
    })

}

