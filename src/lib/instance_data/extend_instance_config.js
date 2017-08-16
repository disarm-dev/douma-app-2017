import {get_instance_file} from 'lib/remote/remote.instance'
import {IncomingInstanceConfigSchema} from 'lib/models/instance_config.schema'
import CONFIG from 'config/common'


// Instance configuration and related files
export const get_instance_files = (slug) => {
  const types = CONFIG.instances.required_instance_files

  return Promise.all(types.map(type => get_instance_file(slug, type)))
    .then(jsons => {
      let instance_config = jsons[0]

      const errors = IncomingInstanceConfigSchema.errors(instance_config)

      if (errors) {
        const message = "Invalid instance_config"
        alert(message + ": If this happens when you reload, please report as an urgent bug! Thanks")
        throw new Error(`${message} ${JSON.stringify(errors)}`)
      }

      // Create object to match up the list of types with the retrieved data
      // Structure of the `jsons_object` is determined by CONFIG.instances.required_instance_files
      const jsons_object = types.reduce((acc, type, index) => {
        acc[type] = jsons[index]
        return acc
      }, {})

      // Other elements to attach
      return {
        ...instance_config,
        form: jsons_object.form,
        location_selection: jsons_object.location_selection,
        aggregations: jsons_object.aggregations,
        fake_form: jsons_object.fake_form,
        validations: jsons_object.validations,
        presenters: jsons_object.presenters,
        decorators: jsons_object.decorators
      }
    })

}

