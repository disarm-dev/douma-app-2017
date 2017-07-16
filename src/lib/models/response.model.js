import uuid from 'uuid/v4'
import which_polygon from 'which-polygon'
import moment from 'moment'

import {ResponseSchema} from './response.schema'
import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name} from '../helpers/spatial_hierarchy_helper'

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

  const responses_with_planning_target_area = get_polygon_for_responses(responses, instance_config)
  return responses_with_planning_target_area
}

function get_polygon_for_responses(responses, instance_config){
  const planning_level_id_field = get_planning_level_id_field()
  const planning_level_name = get_planning_level_name()
  const planning_target_areas = cache.geodata[planning_level_name]
  const query = which_polygon(planning_target_areas)

  const responses_with_planning_target_area = responses.map(response => {
    const response_point = [response.location.coords.longitude, response.location.coords.latitude]
    const found = query(response_point)
    if (found) {
      // TODO: @doc Explain what the 'planning_target_area' is
      response.planning_target_area = found[planning_level_id_field]
    } else {
      response.planning_target_area = null
    }
    return response
  })

  return responses_with_planning_target_area
}
