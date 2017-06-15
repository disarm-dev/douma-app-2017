import cache from 'lib/cache'
import {PlanSchema} from './plan.schema'

export class Plan {
  model;

  create({country, selected_target_area_ids, top_level_spatial_hierarchy}) {
    const decorated_targets = this._decorate_targets({selected_target_area_ids, top_level_spatial_hierarchy})

    this.model = {
      planned_at: new Date(),
      targets: decorated_targets,
      country: country
    }

    this.validate(this.model)
    return this.model
  }

  validate(model) {
    const errors = PlanSchema.errors(model)

    if (errors) {
      console.log(errors)
      throw new Error('PlanSchema validation failed')

    }
  }

  _decorate_targets({selected_target_area_ids, top_level_spatial_hierarchy}) {
    if (!top_level_spatial_hierarchy.hasOwnProperty('field_name') || !top_level_spatial_hierarchy.hasOwnProperty('field_name')) {
      throw 'Missing required properties on top_level_spatial_hierarchy'
    }

    if(!selected_target_area_ids) throw new Error('Missing selected_target_area_ids')

    const selected_target_areas = cache.geodata.all_target_areas.features.filter(feature => {
      return selected_target_area_ids.includes(feature.properties[top_level_spatial_hierarchy.field_name])
    })

    const denominator_definition = top_level_spatial_hierarchy.denominator
    const standard_denominator = Object.keys(denominator_definition)[0] // e.g. number_of_structures
    const instance_specific_denominator_field = denominator_definition[standard_denominator] // e.g. NmStrct

    return selected_target_areas.map((area) => {
      const obj = {}
      obj[standard_denominator] = area.properties[instance_specific_denominator_field]
      obj.id = area.properties[top_level_spatial_hierarchy.field_name]
      return obj
    })
  }

}
