import uuid from 'uuid/v4'
import which_polygon from 'which-polygon'

import {ResponseSchema} from './response.schema'
import cache from 'config/cache'
import {get_planning_level_id_field} from '../spatial_hierarchy_helper'

export class Response {
  model;

  create({recorded_on, id, country, user, location_selection, location, form_data}) {

    if (recorded_on && !id) {
      throw new Error('Response is not valid. Recorded_on was passed but no id. Ensure both are either passed or not.')
    }

    if (!recorded_on && id) {
      throw new Error('Response is not valid. Id was passed but no recorded_on. Ensure both are either passed or not.')
    }

    this.model = {
      location_selection,
      location,
      form_data,
      country,
      user,

      userAgent: navigator.userAgent,
      recorded_on: recorded_on || new Date(),
      id: id || uuid(),
      synced: false,
    }

    this.validate(this.model)
    return this.model
  }


  validate(model) {
    const errors = ResponseSchema.errors(model)

    if (errors) {
      console.log(errors)
      throw new Error('ResponseSchema validation failed')

    }
  }
}


export const decorate_responses_from_json = (json, instance_config) => {
  const responses = json.map(response => {
    response.week = moment(response.recorded_on).week()
    return response
  })

  const planning_level_id_field = get_planning_level_id_field(instance_config)
  const planning_level_name = get_planning_level_name(instance_config)
  const planning_target_areas = cache.geodata[planning_level_name]

  const query = which_polygon(planning_target_areas)

  const responses_with_planning_target_area = responses.map(response => {
    const response_point = [response.location.coords.latitude, response.location.coords.longitude]
    const found = query(response_point)
    if (found) {
      response.planning_target_area = found[planning_level_id_field]
    } else {
      response.planning_target_area = null
    }
    return response
  })

  return responses_with_planning_target_area

}

// const _find_polygons_for_points = (polygons, points) => {
//   // TODO: @feature Load geodata properly on this component
//   console.log('find_polygons_for_points')
//   if (!Object.keys(cache).length) return
//
//
//   const points = this.$store.state.irs_monitor.responses.map((response) => {
//     let {latitude, longitude} = response.location.coords
//     return [latitude, longitude]
//   })
//
//   console.log(cache, points)
//   // TODO: @feature Wrap this in a loop of the spatial_hierarchy levels
//   const query = which_polygon(cache.geodata['constituencies' || this.planning_level_name])
//
//   let results = []
//   points.forEach((point) => {
//     results.push(query(point))
//   })
//   console.log(results)
// }
