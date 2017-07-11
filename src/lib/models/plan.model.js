import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name, get_denominator_fields} from 'lib/spatial_hierarchy_helper'
import {PlanSchema} from './plan.schema'

export class Plan {
  model;

  create({instance_config, selected_target_area_ids, focus_filter_area}) {
    const decorated_targets = this._decorate_targets({selected_target_area_ids, instance_config})
    const country = instance_config.instance.slug

    this.model = {
      focus_filter_area,
      planned_at: new Date().toISOString(),
      targets: decorated_targets,
      country: country
    }

    this.validate(this.model)
    return this.model
  }

  validate(plan_json) {
    const errors = PlanSchema.errors(plan_json)

    if (errors) {
      console.error('Validation errors:', errors)
      throw new Error('PlanSchema validation failed')
    }
  }

  _decorate_targets({selected_target_area_ids, instance_config}) {
    const planning_level_id_field = get_planning_level_id_field(instance_config)
    const planning_level_name = get_planning_level_name(instance_config)
    const denominator_fields = get_denominator_fields(instance_config)

    if(!selected_target_area_ids) throw new Error('Missing selected_target_area_ids')

    const selected_target_areas = cache.geodata[planning_level_name].features.filter(feature => {
      return selected_target_area_ids.includes(feature.properties[planning_level_id_field])
    })

    const standard_denominator = Object.keys(denominator_fields)[0] // e.g. number_of_structures
    const instance_specific_denominator_field = denominator_fields[standard_denominator] // e.g. NmStrct

    return selected_target_areas.map((area) => {
      const obj = {}
      obj[standard_denominator] = area.properties[instance_specific_denominator_field]
      obj.assigned_to_team_name = null
      obj.id = area.properties[planning_level_id_field]
      return obj
    })
  }

  /**
   * Create Assignments from a JSON representation of a Plan.
   * @param plan_json
   * @return [Assignments]
   */
  get_assignments(plan_json) {
    return plan_json.targets.map(target => {
      return {
        id: target.id,
        assigned_to_team_name: target.assigned_to_team_name
      }
    })
  }
}
